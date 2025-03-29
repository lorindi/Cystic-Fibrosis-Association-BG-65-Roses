import { userResolvers } from './userResolvers';
import { campaignResolvers } from './campaignResolvers';
import { initiativeResolvers } from './initiativeResolvers';
import { conferenceResolvers } from './conferenceResolvers';

// Date scalar type
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

// Subscription resolver
const subscriptionResolvers = {
  Subscription: {
    messageSent: {
      subscribe: (_: unknown, { roomId, userId }: { roomId?: string, userId?: string }) => {
        // Тук ще се имплементира логиката за абонирането за съобщения
        // Ще използваме PubSub механизма на Apollo Server
      }
    }
  }
};

// Обединяваме всички resolvers
export const resolvers = {
  ...dateScalar,
  
  Query: {
    ...userResolvers.Query,
    ...campaignResolvers.Query,
    ...initiativeResolvers.Query,
    ...conferenceResolvers.Query,
  },
  
  Mutation: {
    ...userResolvers.Mutation,
    ...campaignResolvers.Mutation,
    ...initiativeResolvers.Mutation,
    ...conferenceResolvers.Mutation,
  },
  
  ...subscriptionResolvers,
}; 