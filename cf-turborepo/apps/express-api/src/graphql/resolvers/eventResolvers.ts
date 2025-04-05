import { AuthenticationError } from '../utils/errors';
import { UserRole, UserGroup } from '../../types/user.types';
import Event from '../../models/event.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const eventResolvers = {
  Query: {
    getEvent: async (_: unknown, { id }: { id: string }) => {
      try {
        const event = await Event.findById(id)
          .populate('createdBy')
          .populate('participants');
          
        if (!event) {
          throw new Error('Event not found');
        }
        
        return event;
      } catch (err) {
        throw new Error('Error fetching event');
      }
    },
    
    getEvents: async () => {
      try {
        return await Event.find()
          .populate('createdBy')
          .populate('participants')
          .sort({ date: -1 });
      } catch (err) {
        throw new Error('Error fetching events');
      }
    },
  },

  Mutation: {
    createEvent: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "събития"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.EVENTS))) {
        throw new AuthenticationError('You do not have permission to create events');
      }
      
      try {
        const newEvent = new Event({
          ...input,
          createdBy: user.id,
        });
        
        const savedEvent = await newEvent.save();
        return await Event.findById(savedEvent._id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating event: ${err.message}`);
        }
        throw new Error('Unexpected error during event creation');
      }
    },
    
    updateEvent: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "събития"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.EVENTS))) {
        throw new AuthenticationError('You do not have permission to edit events');
      }
      
      try {
        const event = await Event.findById(id);
        if (!event) {
          throw new Error('Event not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на събитието
        if (user.role !== UserRole.ADMIN && event.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only edit events you have created');
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { ...input },
          { new: true, runValidators: true }
        )
          .populate('createdBy')
          .populate('participants');
          
        return updatedEvent;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating event: ${err.message}`);
        }
        throw new Error('Unexpected error during event update');
      }
    },
    
    deleteEvent: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "събития"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.EVENTS))) {
        throw new AuthenticationError('You do not have permission to delete events');
      }
      
      try {
        const event = await Event.findById(id);
        if (!event) {
          throw new Error('Event not found');
        }
        
        // Ако не е админ, проверяваме дали е създател на събитието
        if (user.role !== UserRole.ADMIN && event.createdBy.toString() !== user.id) {
          throw new AuthenticationError('You can only delete events you have created');
        }
        
        await Event.findByIdAndDelete(id);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting event: ${err.message}`);
        }
        throw new Error('Unexpected error during event deletion');
      }
    },
    
    joinEvent: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const event = await Event.findById(id);
        if (!event) {
          throw new Error('Event not found');
        }
        
        // Проверка дали потребителят вече е записан
        if (event.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are already registered for this event');
        }
        
        // Записване за събитието
        event.participants.push(user.id);
        await event.save();
        
        return await Event.findById(id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error registering for event: ${err.message}`);
        }
        throw new Error('Unexpected error during event registration');
      }
    },
    
    leaveEvent: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const event = await Event.findById(id);
        if (!event) {
          throw new Error('Event not found');
        }
        
        // Проверка дали потребителят е записан
        if (!event.participants.some(p => p.toString() === user.id)) {
          throw new Error('You are not registered for this event');
        }
        
        // Отписване от събитието
        event.participants = event.participants.filter(
          p => p.toString() !== user.id
        );
        await event.save();
        
        return await Event.findById(id)
          .populate('createdBy')
          .populate('participants');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error unregistering from event: ${err.message}`);
        }
        throw new Error('Unexpected error during event unregistration');
      }
    },
  },
};