import { AuthenticationError } from 'apollo-server-express';
import { UserRole, UserGroup } from '../../types/user.types';
import Initiative from '../../models/initiative.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const initiativeResolvers = {
  Query: {
    getInitiative: async (_: unknown, { id }: { id: string }) => {
      try {
        const initiative = await Initiative.findById(id)
          .populate('createdBy')
          .populate('participants');
          
        if (!initiative) {
          throw new Error('Initiative not found');
        }
        
        return initiative;
      } catch (err) {
        throw new Error('Error fetching initiative');
      }
    },
    
    getInitiatives: async () => {
      try {
        return await Initiative.find()
          .populate('createdBy')
          .populate('participants')
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Error fetching initiatives');
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
            throw new Error('Error fetching user initiatives');
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
  },
}; 