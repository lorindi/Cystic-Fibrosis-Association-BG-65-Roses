import { AuthenticationError } from '../utils/errors';
import { UserRole, UserGroup } from '../../types/user.types';
import Conference from '../../models/conference.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const conferenceResolvers = {
  Query: {
    getConference: async (_: unknown, { id }: { id: string }) => {
      try {
        const conference = await Conference.findById(id)
          .populate('createdBy')
          .populate('participants');
          
        if (!conference) {
          throw new Error('Conference not found');
        }
        
        return conference;
      } catch (err) {
        throw new Error('Error fetching conference');
      }
    },
    
    getConferences: async () => {
      try {
        return await Conference.find()
          .populate('createdBy')
          .populate('participants')
          .sort({ startDate: -1 });
      } catch (err) {
        throw new Error('Error fetching conferences');
      }
    }
  },

  Mutation: {
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
}; 