import { AuthenticationError } from '../utils/errors';
import { UserRole, UserGroup } from '../../types/user.types';
import Initiative from '../../models/initiative.model';
import User from '../../models/user.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const initiativeResolvers = {
  Query: {
    getInitiative: async (_: unknown, { id }: { id: string }) => {
      try {
        const initiative = await Initiative.findById(id)
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
          
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        return initiative;
      } catch (err) {
        throw new Error('Error fetching initiative');
      }
    },
    
    getInitiatives: async (
      _: unknown,
      { limit, offset, noLimit }: { limit?: number; offset?: number; noLimit?: boolean }
    ) => {
      try {
        let query = Initiative.find()
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants')
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
        throw new Error('Error fetching initiatives');
      }
    },
    
    getUserInitiatives: async (
      _: unknown,
      { limit, offset, noLimit }: { limit?: number; offset?: number; noLimit?: boolean },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        // Търсим всички инициативи, в които потребителят е записан като участник
        let query = Initiative.find({ participants: user.id })
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
        throw new Error('Error fetching user initiatives');
      }
    },
    
    getPendingInitiativeRequests: async (
      _: unknown, 
      { initiativeId }: { initiativeId: string }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to view pending participants');
      }
      
      try {
        const initiative = await Initiative.findById(initiativeId).populate('pendingParticipants');
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        return initiative.pendingParticipants;
      } catch (err) {
        throw new Error('Error fetching pending initiative requests');
      }
    },
  },

  Mutation: {
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
          participants: [],
          pendingParticipants: []
        });
        
        const savedInitiative = await newInitiative.save();
        return await Initiative.findById(savedInitiative._id)
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
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
        throw new AuthenticationError('You do not have permission to edit initiatives');
      }
      
      try {
        const initiative = await Initiative.findById(id);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на инициативата
        if (user.role !== UserRole.ADMIN && initiative.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only edit initiatives you have created');
        }
        
        const updatedInitiative = await Initiative.findByIdAndUpdate(
          id,
          { ...input },
          { new: true, runValidators: true }
        )
          .populate('createdBy')
          .populate('participants')
          .populate('pendingParticipants');
          
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
    
    joinInitiative: async (_: unknown, { initiativeId }: { initiativeId: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const initiative = await Initiative.findById(initiativeId);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Проверка дали потребителят вече е записан или чака одобрение
        if (initiative.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are already registered for this initiative');
        }
        
        if (initiative.pendingParticipants.some(p => p.toString() === user.id)) {
          throw new Error('Your request to join this initiative is already pending approval');
        }
        
        // Добавяне на потребителя в списъка с чакащи одобрение
        initiative.pendingParticipants.push(user.id);
        await initiative.save();
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error joining initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative join request');
      }
    },
    
    leaveInitiative: async (_: unknown, { initiativeId }: { initiativeId: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const initiative = await Initiative.findById(initiativeId);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Проверка дали потребителят е записан или чака одобрение
        const isParticipant = initiative.participants.some(p => p.toString() === user.id);
        const isPending = initiative.pendingParticipants.some(p => p.toString() === user.id);
        
        if (!isParticipant && !isPending) {
          throw new Error('You are not registered for this initiative');
        }
        
        // Премахване от съответния списък
        if (isParticipant) {
          initiative.participants = initiative.participants.filter(
            p => p.toString() !== user.id
          );
        }
        
        if (isPending) {
          initiative.pendingParticipants = initiative.pendingParticipants.filter(
            p => p.toString() !== user.id
          );
        }
        
        await initiative.save();
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error leaving initiative: ${err.message}`);
        }
        throw new Error('Unexpected error during initiative leave');
      }
    },
    
    approveInitiativeParticipant: async (
      _: unknown, 
      { initiativeId, userId }: { initiativeId: string, userId: string }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to approve participants');
      }
      
      try {
        const initiative = await Initiative.findById(initiativeId);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Проверка дали потребителят е в списъка с чакащи
        if (!initiative.pendingParticipants.some(p => p.toString() === userId)) {
          throw new Error('User is not in the pending list for this initiative');
        }
        
        // Проверка дали потребителят съществува
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
          throw new Error('User not found');
        }
        
        // Премахване от чакащите и добавяне към одобрените участници
        initiative.pendingParticipants = initiative.pendingParticipants.filter(
          p => p.toString() !== userId
        );
        initiative.participants.push(userId);
        await initiative.save();
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error approving participant: ${err.message}`);
        }
        throw new Error('Unexpected error during participant approval');
      }
    },
    
    rejectInitiativeParticipant: async (
      _: unknown, 
      { initiativeId, userId }: { initiativeId: string, userId: string }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Проверка дали потребителят е админ или е в група "инициативи"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.INITIATIVES))) {
        throw new AuthenticationError('You do not have permission to reject participants');
      }
      
      try {
        const initiative = await Initiative.findById(initiativeId);
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        // Проверка дали потребителят е в списъка с чакащи
        if (!initiative.pendingParticipants.some(p => p.toString() === userId)) {
          throw new Error('User is not in the pending list for this initiative');
        }
        
        // Премахване от чакащите
        initiative.pendingParticipants = initiative.pendingParticipants.filter(
          p => p.toString() !== userId
        );
        await initiative.save();
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error rejecting participant: ${err.message}`);
        }
        throw new Error('Unexpected error during participant rejection');
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
  },
}; 