import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';
import { testEmailConnection, testOAuth2Connection } from './services/emailService';

dotenv.config();

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

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ 
        embed: true,
        includeCookies: true 
      })
    ],
    introspection: true,
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  
  app.use('/graphql', 
    // @ts-ignore 
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  await new Promise<void>((resolve) => 
    httpServer.listen({ port: PORT }, resolve)
  );
  
  console.log(`Express server started on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`GraphQL Explorer available at: http://localhost:${PORT}/graphql`);
}

connectDB().then(() => {
  startApolloServer();
}); 