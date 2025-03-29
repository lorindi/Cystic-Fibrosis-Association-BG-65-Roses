import { AuthenticationError, UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRole, UserGroup, IUserDocument } from '../types/user.types';
import User from '../models/user.model';
import Campaign from '../models/campaign.model';
import Initiative from '../models/initiative.model';
import Conference from '../models/conference.model';

// Utility functions
const generateToken = (user: IUserDocument): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1d' }
  );
};

interface ContextType {
  req: {
    headers: {
      authorization?: string;
    };
  };
}

// Auth middleware
const checkAuth = (context: ContextType) => {
  const authHeader = context.req.headers.authorization;
  
  if (!authHeader) {
    throw new AuthenticationError('Token is not provided');
  }
  
  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    throw new AuthenticationError('Invalid token format. Use: Bearer [token]');
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    return user as jwt.JwtPayload & { id: string; role: UserRole };
  } catch (err) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

// Check permissions 
const checkPermissions = (
  user: { id: string; role: UserRole; groups?: UserGroup[] }, 
  requiredRole?: UserRole, 
  requiredGroup: UserGroup | null = null
) => {
  // Admins have access to everything
  if (user.role === UserRole.ADMIN) return true;
  
  // Check role
  if (requiredRole && user.role !== requiredRole) {
    throw new AuthenticationError('You do not have the necessary rights for this operation');
  }
  
  // Check group
  if (requiredGroup && (!user.groups || !user.groups.includes(requiredGroup))) {
    throw new AuthenticationError(`You do not have access to the group "${requiredGroup}"`);
  }
  
  return true;
};

export const resolvers = {
  // Date scalar type
  Date: {
    __parseValue(value: unknown) {
      return new Date(value as string | number);
    },
    __serialize(value: Date) {
      return value.toISOString();
    },
  },
  
  Query: {
    // User queries
    getCurrentUser: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      try {
        return await User.findById(user.id);
      } catch (err) {
        throw new Error('Error fetching user');
      }
    },
    
    getUser: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      try {
        return await User.findById(id);
      } catch (err) {
        throw new Error('User not found');
      }
    },
    
    getUsers: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      // Only admins can see all users
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        return await User.find();
      } catch (err) {
        throw new Error('Error fetching users');
      }
    },
    
    getUsersByRole: async (_: unknown, { role }: { role: UserRole }, context: ContextType) => {
      const user = checkAuth(context);
      // Only admins can filter users by role
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        return await User.find({ role });
      } catch (err) {
        throw new Error('Error fetching users');
      }
    },
    
    getUsersByGroup: async (_: unknown, { group }: { group: UserGroup }, context: ContextType) => {
      const user = checkAuth(context);
      // Only admins can filter users by group
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        return await User.find({ groups: group });
      } catch (err) {
        throw new Error('Error fetching users');
      }
    },
    
    // Campaign queries
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
        throw new Error('Грешка при извличане на кампаниите на потребителя');
      }
    },
    
    // Initiative queries
    getInitiative: async (_: unknown, { id }: { id: string }) => {
      try {
        const initiative = await Initiative.findById(id)
          .populate('createdBy')
          .populate('participants');
          
        if (!initiative) {
          throw new Error('Инициативата не е намерена');
        }
        
        return initiative;
      } catch (err) {
        throw new Error('Грешка при извличане на инициатива');
      }
    },
    
    getInitiatives: async () => {
      try {
        return await Initiative.find()
          .populate('createdBy')
          .populate('participants')
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Грешка при извличане на инициативи');
      }
    },
    
    getUserInitiatives: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        // Търсим всички инициативи, в които потребителят е записан като участник
        const initiatives = await Initiative.find({ participants: user.id })
          .populate('createdBy')
          .populate('participants')
          .sort({ startDate: -1 });
          
        return initiatives;
      } catch (err) {
        throw new Error('Грешка при извличане на инициативите на потребителя');
      }
    },
    
    // Conference queries
    getConference: async (_: unknown, { id }: { id: string }) => {
      try {
        const conference = await Conference.findById(id)
          .populate('createdBy')
          .populate('participants');
          
        if (!conference) {
          throw new Error('Конференцията не е намерена');
        }
        
        return conference;
      } catch (err) {
        throw new Error('Грешка при извличане на конференция');
      }
    },
    
    getConferences: async () => {
      try {
        return await Conference.find()
          .populate('createdBy')
          .populate('participants')
          .sort({ startDate: -1 });
      } catch (err) {
        throw new Error('Грешка при извличане на конференции');
      }
    }
  },
  
  Mutation: {
    // Authentication mutations
    register: async (_: unknown, { input }: { input: { name: string; email: string; password: string } }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new UserInputError('User with this email already exists');
        }
        
        // Create new user
        const newUser = new User({
          name: input.name,
          email: input.email,
          password: input.password, // Password will be hashed in pre-save hook
          role: UserRole.DONOR, // Default role = дарител
          isEmailVerified: false
        });
        
        // Save user
        const savedUser = await newUser.save();
        
        // Generate token
        const token = generateToken(savedUser);
        
        return {
          token,
          user: savedUser
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Registration error: ${err.message}`);
        }
        throw new Error('Unexpected error during registration');
      }
    },
    
    login: async (_: unknown, { input }: { input: { email: string; password: string } }) => {
      try {
        // Find user by email
        const user = await User.findOne({ email: input.email }).select('+password');
        if (!user) {
          throw new UserInputError('Invalid email or password');
        }
        
        // Check password
        const isMatch = await user.comparePassword(input.password);
        if (!isMatch) {
          throw new UserInputError('Invalid email or password');
        }
        
        // Generate token
        const token = generateToken(user);
        
        return {
          token,
          user
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Login error: ${err.message}`);
        }
        throw new Error('Unexpected error during login');
      }
    },
    
    updateProfile: async (_: unknown, { input }: { input: unknown }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { profile: input },
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating profile: ${err.message}`);
        }
        throw new Error('Unexpected error during profile update');
      }
    },
    
    setUserRole: async (
      _: unknown, 
      { userId, role }: { userId: string; role: UserRole }, 
      context: ContextType
    ) => {
      const currentUser = checkAuth(context);
      // Only admins can change user roles
      checkPermissions(currentUser, UserRole.ADMIN);
      
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true, runValidators: true }
        );
        
        if (!user) {
          throw new Error('User not found');
        }
        
        return user;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error changing role: ${err.message}`);
        }
        throw new Error('Unexpected error during role change');
      }
    },
    
    addUserToGroup: async (
      _: unknown, 
      { userId, group }: { userId: string; group: UserGroup }, 
      context: ContextType
    ) => {
      const currentUser = checkAuth(context);
      // Only admins can add users to groups
      checkPermissions(currentUser, UserRole.ADMIN);
      
      try {
        const user = await User.findById(userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Check if user already in group
        if (user.groups && user.groups.includes(group)) {
          return user; // User already in group, return user
        }
        
        // Add to group
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { groups: group } },
          { new: true, runValidators: true }
        );
        
        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error adding to group: ${err.message}`);
        }
        throw new Error('Unexpected error during group addition');
      }
    },
    
    removeUserFromGroup: async (
      _: unknown, 
      { userId, group }: { userId: string; group: UserGroup }, 
      context: ContextType
    ) => {
      const currentUser = checkAuth(context);
      // Only admins can remove users from groups
      checkPermissions(currentUser, UserRole.ADMIN);
      
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { groups: group } },
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error removing from group: ${err.message}`);
        }
        throw new Error('Unexpected error during group removal');
      }
    },
    
    // Campaign mutations
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
    
    // Initiative mutations
    createInitiative: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to create initiatives');
      }
      
      try {
        const newInitiative = new Initiative({
          ...input,
          createdBy: user.id,
        });
        
        const savedInitiative = await newInitiative.save();
        return await Initiative.findById(savedInitiative._id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative creation');
      }
    },
    
    updateInitiative: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('Нямате права за редактиране на инициативи');
      }
      
      try {
        const initiative = await Initiative.findById(id);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на инициативата
        if (user.role !== UserRole.ADMIN && initiative.createdBy.toString() !== user.id) {
          throw new AuthenticationError('Можете да редактирате само инициативи, които сте създали');
        }
        
        const updatedInitiative = await Initiative.findByIdAndUpdate(
          id,
          { ...input },
          { new: true, runValidators: true }
        )
          .populate('createdBy')
          .populate('participants');
          
        return updatedInitiative;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative update');
      }
    },
    
    deleteInitiative: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to delete initiatives');
      }
      
      try {
        const initiative = await Initiative.findById(id);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на инициативата
        if (user.role !== UserRole.ADMIN && initiative.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only delete initiatives you have created');
        }
        
        await Initiative.findByIdAndDelete(id);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative deletion');
      }
    },
    
    joinInitiative: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      // Само пациенти могат да се записват за инициативи според изискванията
      if (user.role !== UserRole.PATIENT) {
        throw new AuthenticationError('Only patients can register for initiatives');
      }
      
      try {
        const initiative = await Initiative.findById(id);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Проверка дали потребителят вече е записан
        if (initiative.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are already registered for this initiative');
        }
        
        // Записване за инициативата
        initiative.participants.push(user.id);
        await initiative.save();
        
        return await Initiative.findById(id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error registering for initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative registration');
      }
    },
    
    leaveInitiative: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const initiative = await Initiative.findById(id);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Проверка дали потребителят е записан
        if (!initiative.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are not registered for this initiative');
        }
        
        // Отписване от инициативата
        initiative.participants = initiative.participants.filter(
          p => p.toString() !== user.id
        );
        await initiative.save();
        
        return await Initiative.findById(id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error unregistering from initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative unregistration');
      }
    },
    
    addInitiativeItem: async (
      _: unknown, 
      { initiativeId, input }: { initiativeId: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to add items to initiatives');
      }
      
      try {
        const initiative = await Initiative.findById(initiativeId);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на инициативата
        if (user.role !== UserRole.ADMIN && initiative.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only add items to initiatives you have created');
        }
        
        // Добавяне на артикул към инициативата
        initiative.items.push(input);
        await initiative.save();
        
        return initiative.items[initiative.items.length - 1];
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error adding item to initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative item addition');
      }
    },
    
    updateInitiativeItem: async (
      _: unknown, 
      { itemId, input }: { itemId: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to edit items in initiatives');
      }
      
      try {
        // Намираме инициативата, съдържаща този артикул
        const initiative = await Initiative.findOne({ 'items._id': itemId });
        if (!initiative) {
          throw new Error('Initiative or item not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на инициативата
        if (user.role !== UserRole.ADMIN && initiative.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only edit items in initiatives you have created');
        }
        
        // Намираме индекса на артикула
        const itemIndex = initiative.items.findIndex(i => i._id?.toString() === itemId);
        if (itemIndex === -1) {
          throw new Error('Item not found');
        }
        
        // Актуализираме артикула
        initiative.items[itemIndex] = { ...initiative.items[itemIndex], ...input };
        await initiative.save();
        
        return initiative.items[itemIndex];
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating initiative item: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative item update');
      }
    },
    
    deleteInitiativeItem: async (_: unknown, { itemId }: { itemId: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to delete items from initiatives');
      }
      
      try {
        // Намираме инициативата, съдържаща този артикул
        const initiative = await Initiative.findOne({ 'items._id': itemId });
        if (!initiative) {
          throw new Error('Initiative or item not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на инициативата
        if (user.role !== UserRole.ADMIN && initiative.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only delete items from initiatives you have created');
        }
        
        // Изтриваме артикула
        await Initiative.updateOne(
          { _id: initiative._id },
          { $pull: { items: { _id: itemId } } }
        );
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting item from initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative item deletion');
      }
    },
    
    // Conference mutations
    createConference: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "конференции"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.CONFERENCES))) {
        throw new AuthenticationError('You do not have permission to create conferences');
      }
      
      try {
        const newConference = new Conference({
          ...input,
          createdBy: user.id,
        });
        
        const savedConference = await newConference.save();
        return await Conference.findById(savedConference._id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating conference: ${err.message}`);
        }
        throw new Error('Unexpected error during conference creation');
      }
    },
    
    updateConference: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "конференции"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.CONFERENCES))) {
        throw new AuthenticationError('You do not have permission to edit conferences');
      }
      
      try {
        const conference = await Conference.findById(id);
        if (!conference) {
          throw new Error('Conference not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на конференцията
        if (user.role !== UserRole.ADMIN && conference.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only edit conferences you have created');
        }
        
        const updatedConference = await Conference.findByIdAndUpdate(
          id,
          { ...input },
          { new: true, runValidators: true }
        )
          .populate('createdBy')
          .populate('participants');
          
        return updatedConference;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating conference: ${err.message}`);
        }
        throw new Error('Unexpected error during conference update');
      }
    },
    
    deleteConference: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "конференции"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.CONFERENCES))) {
        throw new AuthenticationError('You do not have permission to delete conferences');
      }
      
      try {
        const conference = await Conference.findById(id);
        if (!conference) {
          throw new Error('Conference not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на конференцията
        if (user.role !== UserRole.ADMIN && conference.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only delete conferences you have created');
        }
        
        await Conference.findByIdAndDelete(id);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting conference: ${err.message}`);
        }
        throw new Error('Unexpected error during conference deletion');
      }
    },
    
    joinConference: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const conference = await Conference.findById(id);
        if (!conference) {
          throw new Error('Conference not found');
        }
        
        // Проверка дали потребителят вече е записан
        if (conference.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are already registered for this conference');
        }
        
        // Записване за конференцията
        conference.participants.push(user.id);
        await conference.save();
        
        return await Conference.findById(id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error registering for conference: ${err.message}`);
        }
        throw new Error('Unexpected error during conference registration');
      }
    },
    
    leaveConference: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const conference = await Conference.findById(id);
        if (!conference) {
          throw new Error('Conference not found');
        }
        
        // Проверка дали потребителят е записан
        if (!conference.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are not registered for this conference');
        }
        
        // Отписване от конференцията
        conference.participants = conference.participants.filter(
          p => p.toString() !== user.id
        );
        await conference.save();
        
        return await Conference.findById(id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error unregistering from conference: ${err.message}`);
        }
        throw new Error('Unexpected error during conference unregistration');
      }
    },
    
    // Управление на програмата на конференцията
    addConferenceSession: async (
      _: unknown, 
      { conferenceId, input }: { conferenceId: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "конференции"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.CONFERENCES))) {
        throw new AuthenticationError('You do not have permission to add sessions to conferences');
      }
      
      try {
        const conference = await Conference.findById(conferenceId);
        if (!conference) {
          throw new Error('Conference not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на конференцията
        if (user.role !== UserRole.ADMIN && conference.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only add sessions to conferences you have created');
        }
        
        // Добавяне на сесия към програмата на конференцията
        conference.agenda.push(input);
        await conference.save();
        
        // Сортираме сесиите по startTime
        conference.agenda.sort((a, b) => {
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        });
        
        await conference.save();
        
        return conference.agenda[conference.agenda.length - 1];
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error adding session to conference: ${err.message}`);
        }
        throw new Error('Unexpected error during conference session addition');
      }
    },
    
    updateConferenceSession: async (
      _: unknown, 
      { sessionId, input }: { sessionId: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "конференции"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.CONFERENCES))) {
        throw new AuthenticationError('You do not have permission to edit sessions in conferences');
      }
      
      try {
        // Намираме конференцията, съдържаща тази сесия
        const conference = await Conference.findOne({ 'agenda._id': sessionId });
        if (!conference) {
          throw new Error('Conference or session not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на конференцията
        if (user.role !== UserRole.ADMIN && conference.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only edit sessions in conferences you have created');
        }
        
        // Намираме индекса на сесията
        const sessionIndex = conference.agenda.findIndex(s => s._id?.toString() === sessionId);
        if (sessionIndex === -1) {
          throw new Error('Session not found');
        }
        
        // Актуализираме сесията
        conference.agenda[sessionIndex] = { ...conference.agenda[sessionIndex], ...input };
        
        // Сортираме сесиите по startTime
        conference.agenda.sort((a, b) => {
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        });
        
        await conference.save();
        
        return conference.agenda[sessionIndex];
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating conference session: ${err.message}`);
        }
        throw new Error('Unexpected error during conference session update');
      }
    },
    
    deleteConferenceSession: async (_: unknown, { sessionId }: { sessionId: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "конференции"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.CONFERENCES))) {
        throw new AuthenticationError('You do not have permission to delete sessions from conferences');
      }
      
      try {
        // Намираме конференцията, съдържаща тази сесия
        const conference = await Conference.findOne({ 'agenda._id': sessionId });
        if (!conference) {
          throw new Error('Conference or session not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на конференцията
        if (user.role !== UserRole.ADMIN && conference.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only delete sessions from conferences you have created');
        }
        
        // Изтриваме сесията
        await Conference.updateOne(
          { _id: conference._id },
          { $pull: { agenda: { _id: sessionId } } }
        );
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting conference session: ${err.message}`);
        }
        throw new Error('Unexpected error during conference session deletion');
      }
    }
  },
  
  Subscription: {
    messageSent: {
      subscribe: (_: unknown, { roomId, userId }: { roomId?: string, userId?: string }) => {
        // Тук ще се имплементира логиката за абонирането за съобщения
        // Ще използваме PubSub механизма на Apollo Server
      }
    }
  }
}; 