import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';
import { testEmailConnection, testOAuth2Connection } from './services/emailService';
import cookieParser from 'cookie-parser';

dotenv.config();

// Създаваме тип за конфигурирането на WebSocket сървъра
declare module 'graphql-ws/lib/use/ws' {
  interface ServerOptions {
    schema: any;
    context?: (ctx: { connectionParams?: any }) => any;
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cystic-fibrosis-db');
    console.log(`MongoDB connected: ${conn.connection.host}`);
    await testOAuth2Connection();
    await testEmailConnection();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unexpected error occurred while connecting to the database`);
    }
    process.exit(1);
  }
};

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 5000;

  // Schema за GraphQL
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Настройка на WebSocket сървъра за абонаменти
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Типове за WebSocket контекста
  interface WSConnectionParams {
    authorization?: string;
    [key: string]: any; // За да позволи други параметри
  }

  // Функция за почистване на WebSocket ресурсите
  const serverCleanup = useWsServer({
    schema,
    // Контекст за абонаментите
    context: async (ctx: { connectionParams?: WSConnectionParams }) => {
      return { req: { headers: ctx.connectionParams } };
    }
  }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ 
        embed: true,
        includeCookies: true 
      })
    ],
    introspection: true,
  });

  await server.start();

  // CORS настройки, които позволяват изпращане на cookies
  const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, // Това е важно, за да може браузърът да изпраща cookies
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser()); // Добавяме middleware за парсване на cookies
  
  app.use('/graphql', 
    // @ts-ignore 
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }), // Добавяме res обекта за да можем да манипулираме cookies
    })
  );

  await new Promise<void>((resolve) => 
    httpServer.listen({ port: PORT }, resolve)
  );
  
  console.log(`Express server started on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`GraphQL Explorer available at: http://localhost:${PORT}/graphql`);
  console.log(`WebSocket endpoint for subscriptions: ws://localhost:${PORT}/graphql`);
}

connectDB().then(() => {
  startApolloServer();
}); 