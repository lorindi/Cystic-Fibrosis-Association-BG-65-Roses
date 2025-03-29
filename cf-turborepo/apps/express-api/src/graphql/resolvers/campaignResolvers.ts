import { AuthenticationError } from 'apollo-server-express';
import { UserRole } from '../../types/user.types';
import Campaign from '../../models/campaign.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

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
    
    getCampaigns: async () => {
      try {
        return await Campaign.find()
          .populate('createdBy')
          .populate('participants')
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Error fetching campaigns');
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
    
    getUserCampaigns: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        // Търсим всички кампании, в които потребителят е записан като участник
        const campaigns = await Campaign.find({ participants: user.id })
          .populate('createdBy')
          .populate('participants')
          .sort({ startDate: -1 });
          
        return campaigns;
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
      // Only admin users can create campaigns
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        const newCampaign = new Campaign({
          ...input,
          createdBy: user.id,
        });
        
        const savedCampaign = await newCampaign.save();
        return await Campaign.findById(savedCampaign._id)
          .populate('createdBy')
          .populate('participants');
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
      // Only admin users can update campaigns
      checkPermissions(user, UserRole.ADMIN);
      
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
          .populate('participants');
          
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
      // Only admin users can delete campaigns
      checkPermissions(user, UserRole.ADMIN);
      
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
      // Only admin users can add events to campaigns
      checkPermissions(user, UserRole.ADMIN);
      
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
      // Only admin users can update campaign events
      checkPermissions(user, UserRole.ADMIN);
      
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
      // Only admin users can delete campaign events
      checkPermissions(user, UserRole.ADMIN);
      
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
        
        // Проверка дали потребителят вече е записан
        if (campaign.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are already registered for this campaign');
        }
        
        // Записване за кампанията
        campaign.participants.push(user.id);
        await campaign.save();
        
        return await Campaign.findById(id)
          .populate('createdBy')
          .populate('participants');
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
  },
}; 