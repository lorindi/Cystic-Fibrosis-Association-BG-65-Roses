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
import { stripeService } from './services/stripeService';
import { Payment } from './models/payment.model';
import { PaymentStatus } from './types/payment.types';

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

  // Конфигурация за Stripe webhook - трябва да бъде ПРЕДИ другите middleware
  app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      res.status(400).send('Missing Stripe signature');
      return;
    }

    try {
      // Обработка на събитието от Stripe
      const event = await stripeService.handleWebhookEvent(signature, req.body);

      console.log(`Received Stripe event: ${event.type}`);

      // Обработка на различните типове събития
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Плащането е успешно - запис в базата данни
          const paymentIntent = event.data.object;
          
          // Проверяваме дали вече имаме това плащане записано
          const existingPayment = await Payment.findOne({ 
            stripePaymentIntentId: paymentIntent.id 
          });
          
          if (!existingPayment) {
            console.log(`New successful PaymentIntent: ${paymentIntent.id}`);
            // Тук можем да изпълним допълнителна бизнес логика
          }
          break;
          
        case 'payment_intent.payment_failed':
          // Плащането е неуспешно - актуализиране на статуса
          const failedPaymentIntent = event.data.object;
          
          await Payment.findOneAndUpdate(
            { stripePaymentIntentId: failedPaymentIntent.id },
            { status: PaymentStatus.FAILED }
          );
          
          console.log(`Unsuccessful PaymentIntent: ${failedPaymentIntent.id}`);
          break;
        
        case 'payment_method.attached':
          // Добавен е нов платежен метод
          const paymentMethod = event.data.object;
          console.log(`Added new payment method: ${paymentMethod.id}`);
          break;
        
        case 'payment_intent.created':
          // Платежно намерение е създадено
          const createdPaymentIntent = event.data.object;
          console.log(`Payment intent created: ${createdPaymentIntent.id}`);
          // Не е нужно да правим нищо специално при създаване на платежно намерение
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Връщаме успешен отговор към Stripe
      res.status(200).send({ received: true });
    } catch (error: unknown) {
          console.error('Error processing Stripe webhook:', error);
      
      // Проверяваме дали error е инстанция на Error, за да достъпим свойството message
      if (error instanceof Error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
      } else {
        res.status(400).send('Webhook Error: Unexpected error');
      }
    }
  });

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
  