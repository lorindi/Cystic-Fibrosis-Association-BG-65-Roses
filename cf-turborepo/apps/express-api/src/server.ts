import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';

// Зареждане на env променливи
dotenv.config();

// Инициализиране на Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Връзка с MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cystic-fibrosis-db');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unexpected error occurred while connecting to the database`);
    }
    process.exit(1);
  }
};

// Настройка на Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
  });

  await server.start();
  // Фиксиране на проблем с типовете на Express и Apollo
  server.applyMiddleware({ 
    app: app as any, 
    path: '/graphql' 
  });
  
  // Стартиране на сървъра
  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Свързване с базата данни и стартиране на сървъра
connectDB().then(() => {
  startApolloServer();
}); 