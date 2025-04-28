import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Инициализиране на Stripe с API ключ от променливите на средата
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil' // Използваме последната стабилна версия на API
});

// Интерфейси за типизация
interface PaymentIntentOptions {
  amount: number; // В най-малката валутна единица (стотинки)
  currency?: string; // Валута, по подразбиране 'bgn'
  description?: string; // Описание на плащането
  receiptEmail?: string; // Имейл за фактура/разписка
  metadata?: Record<string, string>; // Допълнителни метаданни
}

interface StripeCustomerOptions {
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

interface SetupIntentOptions {
  customerId: string;
  metadata?: Record<string, string>;
}

// Сервиз за Stripe операции
export const stripeService = {
  /**
   * Създаване на клиент в Stripe
   */
  createCustomer: async (options: StripeCustomerOptions) => {
    try {
      const customer = await stripe.customers.create({
        email: options.email,
        name: options.name,
        phone: options.phone,
        metadata: options.metadata
      });
      
      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  },

  /**
   * Получаване на данни за клиент по ID
   */
  getCustomer: async (customerId: string) => {
    try {
      return await stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error('Error retrieving Stripe customer:', error);
      throw error;
    }
  },

  /**
   * Създаване на PaymentIntent за извършване на плащане
   */
  createPaymentIntent: async (options: PaymentIntentOptions) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: options.amount,
        currency: options.currency || 'bgn',
        description: options.description,
        receipt_email: options.receiptEmail,
        metadata: options.metadata,
        automatic_payment_methods: {
          enabled: true
        }
      });
      
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  /**
   * Създаване на PaymentIntent свързан с конкретен клиент
   */
  createCustomerPaymentIntent: async (customerId: string, options: PaymentIntentOptions) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: options.amount,
        currency: options.currency || 'bgn',
        customer: customerId,
        description: options.description,
        receipt_email: options.receiptEmail,
        metadata: options.metadata,
        automatic_payment_methods: {
          enabled: true
        }
      });
      
      return paymentIntent;
    } catch (error) {
      console.error('Error creating customer payment intent:', error);
      throw error;
    }
  },

  /**
   * Получаване на данни за PaymentIntent
   */
  getPaymentIntent: async (paymentIntentId: string) => {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw error;
    }
  },

  /**
   * Създаване на възстановяване (refund) за плащане
   */
  createRefund: async (paymentIntentId: string) => {
    try {
      return await stripe.refunds.create({
        payment_intent: paymentIntentId
      });
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  },

  /**
   * Създаване на SetupIntent за запазване на платежен метод
   */
  createSetupIntent: async (options: SetupIntentOptions) => {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: options.customerId,
        metadata: options.metadata,
        usage: 'off_session', // Позволява бъдещи плащания без присъствието на клиента
      });
      
      return setupIntent;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw error;
    }
  },

  /**
   * Получаване на данни за платежен метод
   */
  getPaymentMethod: async (paymentMethodId: string) => {
    try {
      return await stripe.paymentMethods.retrieve(paymentMethodId);
    } catch (error) {
      console.error('Error retrieving payment method:', error);
      throw error;
    }
  },

  /**
   * Прикачане на платежен метод към клиент
   */
  attachPaymentMethodToCustomer: async (paymentMethodId: string, customerId: string) => {
    try {
      return await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
    } catch (error) {
      console.error('Error attaching payment method to customer:', error);
      throw error;
    }
  },

  /**
   * Откачане на платежен метод от клиент
   */
  detachPaymentMethod: async (paymentMethodId: string) => {
    try {
      return await stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      console.error('Error detaching payment method:', error);
      throw error;
    }
  },

  /**
   * Задаване на платежен метод по подразбиране
   */
  setDefaultPaymentMethod: async (customerId: string, paymentMethodId: string) => {
    try {
      // В Stripe няма директен метод за задаване на платежен метод по подразбиране,
      // но можем да обновим клиента с invoice_settings.default_payment_method
      return await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  },

  /**
   * Листване на платежните методи на клиент
   */
  listPaymentMethods: async (customerId: string) => {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
      
      return paymentMethods.data;
    } catch (error) {
      console.error('Error listing payment methods:', error);
      throw error;
    }
  },

  /**
   * Създаване на директно плащане с използване на запазен платежен метод
   */
  createPaymentWithSavedMethod: async (
    customerId: string, 
    paymentMethodId: string, 
    options: PaymentIntentOptions
  ) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: options.amount,
        currency: options.currency || 'bgn',
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        description: options.description,
        metadata: options.metadata
      });
      
      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment with saved method:', error);
      throw error;
    }
  },

  /**
   * Обработка на webhook събития от Stripe
   */
  handleWebhookEvent: async (signature: string, rawBody: Buffer) => {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
      
      return event;
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }
}; 