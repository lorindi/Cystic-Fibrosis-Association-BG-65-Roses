import { AuthenticationError } from '../utils/errors';
import { UserRole } from '../../types/user.types';
import Campaign from '../../models/campaign.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';
import { UserGroup } from '../../types/user.types';

export const campaignResolvers = {
  Query: {
    getCampaign: async (_: unknown, { id }: { id: string }) => {
      try {
        const campaign = await Campaign.findById(id)
          .populate('createdBy')
          .populate('participants');
          
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
        
        return await Campaign.findById(id)
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
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
  },
}; 