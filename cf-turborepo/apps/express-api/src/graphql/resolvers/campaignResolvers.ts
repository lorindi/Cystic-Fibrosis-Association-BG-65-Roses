import { AuthenticationError } from '../utils/errors';
import { UserRole } from '../../types/user.types';
import Campaign from '../../models/campaign.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';
import { UserGroup } from '../../types/user.types';
import { pubsub, EVENTS } from './index';
import { CampaignSortOption } from '../../types/campaign.types';
import { Payment } from '../../models/payment.model';
import { PaymentType, PaymentStatus } from '../../types/payment.types';
import mongoose from 'mongoose';

export const campaignResolvers = {
  Query: {
    getCampaign: async (_: unknown, { id }: { id: string }) => {
      try {
        const campaign = await Campaign.findById(id)
          .populate('createdBy')
          .populate('participants')
          .populate({
            path: 'donations.user',
            model: 'User'
          });
          
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        return campaign;
      } catch (err) {
        throw new Error('Error fetching campaign');
      }
    },
    
    getCampaigns: async (
      _: unknown,
      { limit, offset, noLimit }: { limit?: number; offset?: number; noLimit?: boolean }
    ) => {
      try {
        let query = Campaign.find()
          .populate('createdBy')
          .populate('participants')
          .populate({
            path: 'donations.user',
            model: 'User'
          })
          .sort({ createdAt: -1 });
        
        // Прилагаме пагинация, само ако noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
        
        return await query;
      } catch (err) {
        throw new Error('Error fetching campaigns');
      }
    },
    
    getFilteredCampaigns: async (
      _: unknown,
      { 
        filter, 
        limit, 
        offset, 
        noLimit 
      }: { 
        filter: { 
          sortBy?: string;
          isActive?: boolean;
          minGoal?: number;
          maxGoal?: number;
          minRating?: number;
          hasEvents?: boolean;
        }; 
        limit?: number; 
        offset?: number; 
        noLimit?: boolean 
      }
    ) => {
      try {
        // Създаваме обект за условията на филтриране
        let filterCriteria: any = {};
        
        // Филтриране по активност
        if (filter.isActive !== undefined) {
          const now = new Date();
          if (filter.isActive) {
            // Активна кампания: startDate <= now и (endDate не съществува или endDate >= now)
            filterCriteria.startDate = { $lte: now };
            filterCriteria.$or = [
              { endDate: { $exists: false } },
              { endDate: { $gte: now } }
            ];
          } else {
            // Неактивна кампания: startDate > now или endDate < now
            filterCriteria.$or = [
              { startDate: { $gt: now } },
              { endDate: { $lt: now, $exists: true } }
            ];
          }
        }
        
        // Филтриране по цел
        if (filter.minGoal !== undefined) {
          filterCriteria.goal = { $gte: filter.minGoal };
        }
        
        if (filter.maxGoal !== undefined) {
          if (filterCriteria.goal) {
            filterCriteria.goal.$lte = filter.maxGoal;
          } else {
            filterCriteria.goal = { $lte: filter.maxGoal };
          }
        }
        
        // Филтриране по събития
        if (filter.hasEvents) {
          filterCriteria.events = { $exists: true, $not: { $size: 0 } };
        }
        
        // Създаваме заявката
        let query = Campaign.find(filterCriteria)
          .populate('createdBy')
          .populate('participants')
          .populate({
            path: 'donations.user',
            model: 'User'
          });
        
        // Сортиране според избрания критерий
        if (filter.sortBy) {
          switch (filter.sortBy) {
            case CampaignSortOption.HIGHEST_GOAL:
              query = query.sort({ goal: -1 });
              break;
            case CampaignSortOption.LOWEST_GOAL:
              query = query.sort({ goal: 1 });
              break;
            case CampaignSortOption.MOST_FUNDED:
              query = query.sort({ currentAmount: -1 });
              break;
            case CampaignSortOption.LEAST_FUNDED:
              query = query.sort({ currentAmount: 1 });
              break;
            case CampaignSortOption.NEWEST:
              query = query.sort({ createdAt: -1 });
              break;
            case CampaignSortOption.OLDEST:
              query = query.sort({ createdAt: 1 });
              break;
            default:
              query = query.sort({ createdAt: -1 });
          }
        } else {
          // По подразбиране сортираме по най-новите
          query = query.sort({ createdAt: -1 });
        }
        
        // Прилагаме пагинация, само ако noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
        
        // Изпълняваме заявката
        const campaigns = await query;
        
        // Филтриране по рейтинг (не можем директно да филтрираме по виртуални полета в MongoDB)
        if (filter.minRating !== undefined) {
          return campaigns.filter(campaign => {
            return (campaign as any).totalRating >= filter.minRating!;
          });
        }
        
        return campaigns;
      } catch (err) {
        console.error('Error filtering campaigns:', err);
        throw new Error('Error filtering campaigns');
      }
    },

    getCampaignDonations: async (_: unknown, { campaignId }: { campaignId: string }) => {
      try {
        const campaign = await Campaign.findById(campaignId).populate({
          path: 'donations.user',
          model: 'User'
        });
        
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        return campaign.donations || [];
      } catch (err) {
        throw new Error('Error fetching campaign donations');
      }
    },
    
    getCampaignNotifications: async (
      _: unknown,
      __: unknown,
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Само администратори или потребители с група CAMPAIGNS могат да виждат известия
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to view campaign notifications');
      }
      
      try {
        // Намираме всички кампании с поне един чакащ участник и извличаме необходимите полета
        const campaigns = await Campaign.find({
          pendingParticipants: { $exists: true, $not: { $size: 0 } }
        })
          .select('_id title pendingParticipants')
          .populate('pendingParticipants')
          .sort({ updatedAt: -1 });
        
        // Форматираме данните за известията
        return campaigns.map(campaign => ({
          id: campaign._id,
          title: campaign.title,
          pendingParticipants: campaign.pendingParticipants,
          pendingParticipantsCount: campaign.pendingParticipants.length
        }));
      } catch (err) {
        throw new Error('Error fetching campaign notifications');
      }
    },
    
    getPendingCampaignRequests: async (
      _: unknown, 
      { limit, offset, noLimit }: { limit?: number; offset?: number; noLimit?: boolean },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Само администратори или потребители с група CAMPAIGNS могат да виждат чакащи заявки
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to view pending requests');
      }
      
      try {
        // Намираме всички кампании с поне един чакащ участник
        let query = Campaign.find({
          pendingParticipants: { $exists: true, $not: { $size: 0 } }
        })
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants')
          .sort({ startDate: -1 });
        
        // Прилагаме пагинация, само ако noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
          
        return await query;
      } catch (err) {
        throw new Error('Error fetching pending campaign requests');
      }
    },
    
    getCampaignEvents: async (_: unknown, { campaignId }: { campaignId: string }) => {
      try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        return campaign.events;
      } catch (err) {
        throw new Error('Error fetching campaign events');
      }
    },
    
    getUserCampaigns: async (
      _: unknown, 
      { limit, offset, noLimit }: { limit?: number; offset?: number; noLimit?: boolean },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        // Търсим всички кампании, в които потребителят е записан като участник
        let query = Campaign.find({ participants: user.id })
          .populate('createdBy')
          .populate('participants')
          .sort({ startDate: -1 });
        
        // Прилагаме пагинация, само ако noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
          
        return await query;
      } catch (err) {
        throw new Error('Error fetching user campaigns');
      }
    },
  },

  Mutation: {
    createCampaign: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Администратори или потребители с група CAMPAIGNS могат да създават кампании
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to create campaigns');
      }
      
      try {
        const newCampaign = new Campaign({
          ...input,
          createdBy: user.id,
          // Не добавяме създателя автоматично като участник
        });
        
        const savedCampaign = await newCampaign.save();
        return await Campaign.findById(savedCampaign._id)
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating campaign: ${err.message}`);
        }
        throw new Error('Unexpected error during campaign creation');
      }
    },
    
    updateCampaign: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Администратори или потребители с група CAMPAIGNS могат да редактират кампании
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to update campaigns');
      }
      
      try {
        const campaign = await Campaign.findById(id);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        const updatedCampaign = await Campaign.findByIdAndUpdate(
          id,
          { ...input },
          { new: true, runValidators: true }
        )
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
          
        return updatedCampaign;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating campaign: ${err.message}`);
        }
        throw new Error('Unexpected error during campaign update');
      }
    },
    
    deleteCampaign: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Администратори или потребители с група CAMPAIGNS могат да изтриват кампании
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to delete campaigns');
      }
      
      try {
        const campaign = await Campaign.findById(id);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        await Campaign.findByIdAndDelete(id);
        return true;
      } catch (err) {
        throw new Error('Error deleting campaign');
      }
    },
    
    addCampaignEvent: async (
      _: unknown, 
      { campaignId, input }: { campaignId: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Администратори или потребители с група CAMPAIGNS могат да добавят събития към кампании
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to add events to campaigns');
      }
      
      try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        campaign.events.push(input);
        await campaign.save();
        
        return campaign.events[campaign.events.length - 1];
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error adding event to campaign: ${err.message}`);
        }
        throw new Error('Unexpected error during event addition to campaign');
      }
    },
    
    updateCampaignEvent: async (
      _: unknown, 
      { eventId, input }: { eventId: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Администратори или потребители с група CAMPAIGNS могат да редактират събития от кампании
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to update campaign events');
      }
      
      try {
        const campaign = await Campaign.findOne({ 'events._id': eventId });
        if (!campaign) {
          throw new Error('Campaign or event not found');
        }
        
        const eventIndex = campaign.events.findIndex(e => e._id?.toString() === eventId);
        if (eventIndex === -1) {
          throw new Error('Event not found');
        }
        
        // Update the event
        campaign.events[eventIndex] = { ...campaign.events[eventIndex], ...input };
        await campaign.save();
        
        return campaign.events[eventIndex];
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating campaign event: ${err.message}`);
        }
        throw new Error('Unexpected error during campaign event update');
      }
    },
    
    deleteCampaignEvent: async (_: unknown, { eventId }: { eventId: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Администратори или потребители с група CAMPAIGNS могат да изтриват събития от кампании
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to delete campaign events');
      }
      
      try {
        const campaign = await Campaign.findOne({ 'events._id': eventId });
        if (!campaign) {
          throw new Error('Campaign or event not found');
        }
        
        await Campaign.updateOne(
          { _id: campaign._id },
          { $pull: { events: { _id: eventId } } }
        );
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting campaign event: ${err.message}`);
        }
        throw new Error('Unexpected error during campaign event deletion');
      }
    },
    
    // Регистриране за кампания
    joinCampaign: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      // Само пациенти и родители могат да се записват за кампании
      if (user.role !== UserRole.PATIENT && user.role !== UserRole.PARENT) {
        throw new AuthenticationError('Only patients and parents can register for campaigns');
      }
      
      try {
        const campaign = await Campaign.findById(id);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        // Проверка дали потребителят вече е записан или чака одобрение
        if (campaign.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are already registered for this campaign');
        }
        
        if (campaign.pendingParticipants && campaign.pendingParticipants.some(p => p.toString() === user.id)) {
          throw new Error('Your registration is already pending approval');
        }
        
        // Добавяне към чакащите одобрение
        if (!campaign.pendingParticipants) {
          campaign.pendingParticipants = [];
        }
        campaign.pendingParticipants.push(user.id);
        await campaign.save();
        
        // Вземаме обновената кампания с populating
        const updatedCampaign = await Campaign.findById(id)
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
         
        if (!updatedCampaign) {
          throw new Error('Failed to retrieve updated campaign');
        }
          
        // Публикуваме събитие за нов чакащ участник
        const notification = {
          id: campaign._id,
          title: campaign.title,
          pendingParticipants: updatedCampaign.pendingParticipants,
          pendingParticipantsCount: updatedCampaign.pendingParticipants.length
        };
        
        pubsub.publish(EVENTS.CAMPAIGN_PARTICIPANT_PENDING, { 
          campaignParticipantPending: notification 
        });
        
        return updatedCampaign;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error registering for campaign: ${err.message}`);
        }
        throw new Error('Unexpected error during campaign registration');
      }
    },
    
    // Отписване от кампания
    leaveCampaign: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const campaign = await Campaign.findById(id);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        // Проверка дали потребителят е записан
        if (!campaign.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are not registered for this campaign');
        }
        
        // Отписване от кампанията
        campaign.participants = campaign.participants.filter(
          p => p.toString() !== user.id
        );
        await campaign.save();
        
        return await Campaign.findById(id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error unregistering from campaign: ${err.message}`);
        }
        throw new Error('Unexpected error during campaign unregistration');
      }
    },
    
    // Одобряване на чакащ участник
    approveCampaignParticipant: async (
      _: unknown, 
      { campaignId, userId }: { campaignId: string, userId: string }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Само администратори или потребители с група CAMPAIGNS могат да одобряват участници
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to approve participants');
      }
      
      try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        // Проверка дали потребителят е в списъка с чакащи
        if (!campaign.pendingParticipants || !campaign.pendingParticipants.some(p => p.toString() === userId)) {
          throw new Error('User is not in the pending list for this campaign');
        }
        
        // Премахване от чакащите и добавяне към одобрените участници
        campaign.pendingParticipants = campaign.pendingParticipants.filter(
          p => p.toString() !== userId
        );
        campaign.participants.push(userId);
        await campaign.save();
        
        return await Campaign.findById(campaignId)
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error approving participant: ${err.message}`);
        }
        throw new Error('Unexpected error during participant approval');
      }
    },
    
    // Отхвърляне на чакащ участник
    rejectCampaignParticipant: async (
      _: unknown, 
      { campaignId, userId }: { campaignId: string, userId: string }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Само администратори или потребители с група CAMPAIGNS могат да отхвърлят участници
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to reject participants');
      }
      
      try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        // Проверка дали потребителят е в списъка с чакащи
        if (!campaign.pendingParticipants || !campaign.pendingParticipants.some(p => p.toString() === userId)) {
          throw new Error('User is not in the pending list for this campaign');
        }
        
        // Премахване от чакащите
        campaign.pendingParticipants = campaign.pendingParticipants.filter(
          p => p.toString() !== userId
        );
        await campaign.save();
        
        return await Campaign.findById(campaignId)
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error rejecting participant: ${err.message}`);
        }
        throw new Error('Unexpected error during participant rejection');
      }
    },
    
    // Добавяме нова мутация за коментиране и оценяване на кампания след дарение
    addCampaignComment: async (
      _: unknown, 
      { 
        campaignId, 
        comment, 
        rating 
      }: { 
        campaignId: string; 
        comment?: string; 
        rating?: number 
      }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        // Проверка дали кампанията съществува
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        // Проверка дали потребителят е направил плащане за тази кампания
        const payment = await Payment.findOne({ 
          user: user.id, 
          campaign: campaignId,
          type: PaymentType.CAMPAIGN_DONATION,
          status: PaymentStatus.SUCCEEDED
        });
        
        if (!payment) {
          throw new Error('You can only add comments if you have made a donation to this campaign');
        }
        
        // Проверка дали потребителят вече е добавил коментар
        const existingDonation = campaign.donations.find(
          d => d.user.toString() === user.id
        );
        
        if (existingDonation) {
          // Актуализиране на съществуващ коментар
          if (comment !== undefined) {
            existingDonation.comment = comment;
          }
          
          if (rating !== undefined && rating >= 1 && rating <= 5) {
            existingDonation.rating = rating;
          }
        } else {
          // Добавяне на нов коментар
          campaign.donations.push({
            user: new mongoose.Types.ObjectId(user.id),
            amount: payment.amount,
            comment,
            rating,
            date: new Date()
          });
        }
        
        await campaign.save();
        
        return await Campaign.findById(campaignId)
          .populate('createdBy')
          .populate('participants')
          .populate({
            path: 'donations.user',
            model: 'User'
          });
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error adding comment: ${err.message}`);
        }
        throw new Error('Unexpected error when adding comment');
      }
    },
    
    // Добавяме мутация за редактиране на коментар към кампания
    updateCampaignComment: async (
      _: unknown, 
      { 
        campaignId, 
        commentId,
        comment, 
        rating 
      }: { 
        campaignId: string;
        commentId: string;
        comment?: string; 
        rating?: number 
      }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        // Проверка дали кампанията съществува
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        // Намиране на коментара
        const donationIndex = campaign.donations.findIndex(d => d._id?.toString() === commentId);
        if (donationIndex === -1) {
          throw new Error('Comment not found');
        }
        
        const donation = campaign.donations[donationIndex];
        
        // Проверка дали потребителят е собственик на коментара
        if (donation.user.toString() !== user.id) {
          throw new Error('You can only edit your own comments');
        }
        
        // Актуализиране на коментара
        if (comment !== undefined) {
          campaign.donations[donationIndex].comment = comment;
        }
        
        if (rating !== undefined && rating >= 1 && rating <= 5) {
          campaign.donations[donationIndex].rating = rating;
        }
        
        await campaign.save();
        
        return await Campaign.findById(campaignId)
          .populate('createdBy')
          .populate('participants')
          .populate({
            path: 'donations.user',
            model: 'User'
          });
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating comment: ${err.message}`);
        }
        throw new Error('Unexpected error when updating comment');
      }
    },
    
    // Добавяме мутация за изтриване на коментар към кампания
    deleteCampaignComment: async (
      _: unknown, 
      { 
        campaignId, 
        commentId
      }: { 
        campaignId: string;
        commentId: string;
      }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        // Проверка дали кампанията съществува
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        
        // Намиране на коментара
        const donation = campaign.donations.find(d => d._id?.toString() === commentId);
        if (!donation) {
          throw new Error('Comment not found');
        }
        
        // Проверка дали потребителят е собственик на коментара или е администратор
        if (donation.user.toString() !== user.id && user.role !== UserRole.ADMIN) {
          throw new Error('You can only delete your own comments');
        }
        
        // Изтриване на коментара
        campaign.donations = campaign.donations.filter(d => d._id?.toString() !== commentId);
        
        await campaign.save();
        
        return await Campaign.findById(campaignId)
          .populate('createdBy')
          .populate('participants')
          .populate({
            path: 'donations.user',
            model: 'User'
          });
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting comment: ${err.message}`);
        }
        throw new Error('Unexpected error when deleting comment');
      }
    },
    
    // Добавяме мутация за актуализиране на изображенията на кампанията
    updateCampaignImages: async (
      _: unknown, 
      { 
        id, 
        images, 
        imagesCaptions 
      }: { 
        id: string; 
        images: string[]; 
        imagesCaptions?: string[] 
      }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Администратори или потребители с група CAMPAIGNS могат да редактират кампании
      if (user.role !== UserRole.ADMIN && !user.groups?.includes(UserGroup.CAMPAIGNS)) {
        throw new AuthenticationError('You do not have permission to update campaigns');
      }
      
      try {
        // Проверка за максималния брой изображения
        if (images.length > 10) {
          throw new Error('Кампаниите не могат да имат повече от 10 изображения');
        }
        
        // Проверка дали броят на заглавията съответства на броя на изображенията
        if (imagesCaptions && imagesCaptions.length > 0 && imagesCaptions.length !== images.length) {
          throw new Error('Броят на заглавията трябва да съвпада с броя на изображенията');
        }
        
        const campaign = await Campaign.findById(id);
        if (!campaign) {
          throw new Error('Кампанията не е намерена');
        }
        
        // Актуализиране на изображенията и заглавията
        campaign.images = images;
        if (imagesCaptions) {
          campaign.imagesCaptions = imagesCaptions;
        } else {
          // Ако не се подават заглавия, нулираме ги
          campaign.imagesCaptions = [];
        }
        
        await campaign.save();
        
        return await Campaign.findById(id)
          .populate('createdBy')
          .populate('participants')
          .populate({
            path: 'donations.user',
            model: 'User'
          });
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Грешка при актуализиране на изображенията: ${err.message}`);
        }
        throw new Error('Неочаквана грешка при актуализиране на изображенията');
      }
    },
  },
}; 