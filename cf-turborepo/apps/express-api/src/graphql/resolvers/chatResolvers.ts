import { AuthenticationError } from 'apollo-server-express';
import { UserRole } from '../../types/user.types';
import { ChatMessage, AIResponse } from '../../models/chat.model';
import { ContextType, checkAuth } from '../utils/auth';

export const chatResolvers = {
  Query: {
    getChatMessages: async (
      _: unknown, 
      { roomId, userId }: { roomId?: string; userId?: string }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        let query: any = {};
        
        // Съобщения от стая
        if (roomId) {
          query.roomId = roomId;
        } 
        // Лични съобщения между два потребителя
        else if (userId) {
          query = {
            $or: [
              { sender: user.id, receiver: userId },
              { sender: userId, receiver: user.id }
            ]
          };
        } else {
          throw new Error('Either roomId or userId must be provided');
        }
        
        const messages = await ChatMessage.find(query)
          .populate('sender')
          .populate('receiver')
          .sort({ createdAt: 1 });
          
        return messages;
      } catch (err) {
        throw new Error('Error fetching chat messages');
      }
    },
    
    askAI: async (_: unknown, { query }: { query: string }) => {
      try {
        // Тук трябва да има интеграция с AI сървис
        // За сега връщаме проста имитация
        
        const response = "This is a placeholder AI response. In the future, this will be connected to an AI service that can answer questions related to cystic fibrosis, nutrition, and healthy lifestyle.";
        
        // Записваме въпроса и отговора в базата данни
        const aiResponse = new AIResponse({
          query,
          response,
          createdAt: new Date()
        });
        
        await aiResponse.save();
        return aiResponse;
      } catch (err) {
        throw new Error('Error generating AI response');
      }
    }
  },

  Mutation: {
    sendChatMessage: async (
      _: unknown, 
      { input }: { input: { content: string; receiverId?: string; roomId?: string } }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        if (!input.receiverId && !input.roomId) {
          throw new Error('Either receiverId or roomId must be provided');
        }
        
        const message = new ChatMessage({
          content: input.content,
          sender: user.id,
          receiver: input.receiverId,
          roomId: input.roomId,
          createdAt: new Date()
        });
        
        const savedMessage = await message.save();
        
        // Тук ще трябва да публикуваме съобщението чрез PubSub
        // Това ще позволи subscription-ите да работят
        
        return await ChatMessage.findById(savedMessage._id)
          .populate('sender')
          .populate('receiver');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error sending message: ${err.message}`);
        }
        throw new Error('Unexpected error during message sending');
      }
    }
  },
};