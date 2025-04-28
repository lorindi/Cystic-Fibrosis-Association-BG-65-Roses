import { userResolvers } from './userResolvers';
import { campaignResolvers } from './campaignResolvers';
import { initiativeResolvers } from './initiativeResolvers';
import { conferenceResolvers } from './conferenceResolvers';
import { eventResolvers } from './eventResolvers';
import { storeResolvers } from './storeResolvers';
import { newsResolvers } from './newsResolvers';
import { blogResolvers } from './blogResolvers';
import { recipeResolvers } from './recipeResolvers';
import { storyResolvers } from './storyResolvers';
import { chatResolvers } from './chatResolvers';
import { paymentResolvers } from './paymentResolvers';
import { PubSub } from 'graphql-subscriptions';

// Създаваме глобална PubSub инстанция
export const pubsub = new PubSub();

// Събития, които могат да бъдат публикувани
export const EVENTS = {
  CHAT_MESSAGE_SENT: 'CHAT_MESSAGE_SENT',
  CAMPAIGN_PARTICIPANT_PENDING: 'CAMPAIGN_PARTICIPANT_PENDING'
};

// Date скалар тип
const dateScalar = {
  Date: {
    __parseValue(value: unknown) {
      return new Date(value as string | number);
    },
    __serialize(value: Date) {
      return value.toISOString();
    },
  },
};

// Интерфейси за типизация
interface MessageSentPayload {
  messageSent: {
    roomId: string;
    senderId: string;
    receiverId: string;
  }
}

interface MessageSentVariables {
  roomId?: string;
  userId?: string;
}

// Обединяване на всички резолвери
export const resolvers = {
  ...dateScalar,
  Query: {
    ...userResolvers.Query,
    ...campaignResolvers.Query,
    ...initiativeResolvers.Query,
    ...conferenceResolvers.Query,
    ...eventResolvers.Query,
    ...storeResolvers.Query,
    ...newsResolvers.Query,
    ...blogResolvers.Query,
    ...recipeResolvers.Query,
    ...storyResolvers.Query,
    ...chatResolvers.Query,
    ...paymentResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...campaignResolvers.Mutation,
    ...initiativeResolvers.Mutation,
    ...conferenceResolvers.Mutation,
    ...eventResolvers.Mutation,
    ...storeResolvers.Mutation,
    ...newsResolvers.Mutation,
    ...blogResolvers.Mutation,
    ...recipeResolvers.Mutation,
    ...storyResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...paymentResolvers.Mutation
  },
  Subscription: {
    messageSent: {
      subscribe: (_: unknown, { roomId, userId }: MessageSentVariables) => {
        const filter = (payload: MessageSentPayload, variables: MessageSentVariables) => {
          if (variables.roomId && payload.messageSent.roomId !== variables.roomId) {
            return false;
          }
          if (variables.userId && payload.messageSent.senderId !== variables.userId && 
              payload.messageSent.receiverId !== variables.userId) {
            return false;
          }
          return true;
        };

        return (pubsub as any).asyncIterator([EVENTS.CHAT_MESSAGE_SENT], { filter });
      }
    },
    campaignParticipantPending: {
      subscribe: () => (pubsub as any).asyncIterator([EVENTS.CAMPAIGN_PARTICIPANT_PENDING])
    }
  }
};