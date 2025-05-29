import { AuthenticationError } from '../utils/errors';
import { UserRole } from '../../types/user.types';
import { Payment } from '../../models/payment.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';
import { stripeService } from '../../services/stripeService';
import User from '../../models/user.model';
import Campaign from '../../models/campaign.model';
import Initiative from '../../models/initiative.model';
import { PaymentStatus, PaymentType } from '../../types/payment.types';
import mongoose, { Types } from 'mongoose';
import { StoreItem, Donor } from '../../models/store.model';

// Интерфейс за обекта с данни за плащането
interface PaymentData {
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  description: string | null;
  user?: Types.ObjectId;
  campaign?: Types.ObjectId;
  initiative?: Types.ObjectId;
  items?: Types.ObjectId[];
  donor?: Types.ObjectId;
}

/**
 * Помощна функция за намиране или създаване на Stripe клиент за потребител
 */
async function findOrCreateStripeCustomer(userId: string): Promise<string> {
  const userData = await User.findById(userId);
  if (!userData) {
    throw new Error('Потребителят не е намерен');
  }

  // Ако потребителят вече има Stripe клиент ID, проверяваме дали съществува
  if (userData.stripeCustomerId) {
    try {
      // Опитваме се да вземем клиента от Stripe
      const customer = await stripeService.getCustomer(userData.stripeCustomerId);
      // Ако заявката е успешна и получим отговор, връщаме ID-то
      if (customer && !customer.deleted) {
        return userData.stripeCustomerId;
      }
      // Ако клиентът е изтрит или не е намерен, ще продължим със създаване на нов
    } catch (error) {
      // При грешка, ще създадем нов клиент
      console.error('Грешка при проверка на съществуващ Stripe клиент:', error);
    }
  }

  // Създаваме нов Stripe клиент
  const customer = await stripeService.createCustomer({
    email: userData.email,
    name: userData.name,
    metadata: { userId: userData._id.toString() }
  });

  // Записваме клиент ID към потребителя
  userData.stripeCustomerId = customer.id;
  await userData.save();

  return customer.id;
}

/**
 * Помощна функция за обработка на донор и обновяване на плащане
 */
async function processDonorAndUpdatePayment(paymentData: PaymentData): Promise<void> {
  console.log('=== processDonorAndUpdatePayment START ===');
  console.log('Payment data:', paymentData);
  
  // Ако имаме потребител, създаваме или обновяваме донора
  if (!paymentData.user) {
    console.log('No user in payment data');
    return;
  }

  console.log('Searching for existing donor...');
  // Намиране или създаване на донор за този потребител
  let donor = await Donor.findOne({ user: paymentData.user });
  
  if (!donor) {
    console.log('No donor found, creating new one...');
    const userData = await User.findById(paymentData.user);
    if (userData) {
      donor = new Donor({
        user: userData._id,
        name: userData.name,
        totalDonations: 0
      });
      console.log('New donor created');
    }
  } else {
    console.log('Existing donor found, total donations:', donor.totalDonations);
  }
  
  // Ако имаме донор, асоциираме го с плащането и обновяваме сумата
  if (donor) {
    donor.totalDonations += paymentData.amount;
    await donor.save();
    console.log('Donor saved with new total:', donor.totalDonations);
    
    // Използваме type assertion, за да избегнем проблема с типизацията
    paymentData.donor = donor._id as any as Types.ObjectId;
    console.log('Donor ID added to payment data:', donor._id);
  }
  
  console.log('=== processDonorAndUpdatePayment END ===');
}

/**
 * Помощна функция за обновяване на кампания при дарение
 */
async function updateCampaignWithDonation(
  campaignId: Types.ObjectId, 
  userId: Types.ObjectId, 
  amount: number
): Promise<void> {
  console.log('=== updateCampaignWithDonation START ===');
  console.log('Campaign ID:', campaignId);
  console.log('User ID:', userId);
  console.log('Amount:', amount);
  
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      console.log('Campaign not found');
      return;
    }
    
    console.log('Campaign found:', campaign.title);
    console.log('Current amount before update:', campaign.currentAmount);
    
    // Обновяваме currentAmount
    campaign.currentAmount += amount;
    
    // Добавяме дарение към масива donations
    campaign.donations.push({
      user: userId,
      amount: amount,
      date: new Date()
    });
    
    await campaign.save();
    console.log('Campaign updated - new currentAmount:', campaign.currentAmount);
    console.log('Total donations count:', campaign.donations.length);
    
  } catch (error) {
    console.error('Error updating campaign:', error);
  }
  
  console.log('=== updateCampaignWithDonation END ===');
}

/**
 * Помощна функция за създаване на метаданни за плащане
 */
function createPaymentMetadata(
  userId: string, 
  type: PaymentType, 
  campaignId?: string, 
  initiativeId?: string, 
  items?: string[]
): Record<string, string> {
  const metadata: Record<string, string> = {
    userId,
    type
  };

  if (campaignId) {
    metadata.campaignId = campaignId;
  }

  if (initiativeId) {
    metadata.initiativeId = initiativeId;
  }

  if (items && items.length > 0) {
    metadata.items = items.join(',');
  }

  // Добавяме уникален идентификатор за идемпотентност
  metadata.idempotencyKey = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  return metadata;
}

export const paymentResolvers = {
  Query: {
    getPayments: async (
      _: unknown,
      { limit = 10, offset = 0 }: { limit?: number; offset?: number },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Само администратори могат да виждат всички плащания
      checkPermissions(user, UserRole.ADMIN);

      try {
        const payments = await Payment.find()
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit);

        const totalCount = await Payment.countDocuments();
        const hasMore = offset + payments.length < totalCount;

        return {
          payments,
          totalCount,
          hasMore
        };
      } catch (error) {
        throw new Error('Грешка при получаване на плащания');
      }
    },

    getPayment: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);

      try {
        const payment = await Payment.findById(id)
          .populate('user')
          .populate('campaign')
          .populate('initiative')
          .populate('items')
          .populate('donor');

        if (!payment) {
          throw new Error('Плащането не е намерено');
        }

        // Проверка дали потребителят има право да види това плащане
        if (user.role !== UserRole.ADMIN && payment.user && payment.user._id.toString() !== user.id) {
          throw new AuthenticationError('Нямате достъп до това плащане');
        }

        return payment;
      } catch (error) {
        if (error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error('Грешка при получаване на плащане');
      }
    },

    getUserPayments: async (
      _: unknown,
      { userId, limit = 10, offset = 0 }: { userId: string; limit?: number; offset?: number },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Проверка на правата: потребителят може да вижда само своите плащания,
      // а администраторът може да вижда плащанията на всички
      if (user.role !== UserRole.ADMIN && user.id !== userId) {
        throw new AuthenticationError('Нямате достъп до плащанията на този потребител');
      }

      try {
        const payments = await Payment.find({ user: userId })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit);

        const totalCount = await Payment.countDocuments({ user: userId });
        const hasMore = offset + payments.length < totalCount;

        return {
          payments,
          totalCount,
          hasMore
        };
      } catch (error) {
        throw new Error('Грешка при получаване на плащания на потребител');
      }
    },

    getPaymentMethods: async (_: unknown, {}: {}, context: ContextType) => {
      const user = checkAuth(context);

      try {
        // Вземаме потребителя от базата данни, за да имаме достъп до stripeCustomerId
        const userData = await User.findById(user.id);
        if (!userData) {
          throw new Error('Потребителят не е намерен');
        }

        // Ако потребителят няма stripeCustomerId, връщаме празен масив
        if (!userData.stripeCustomerId) {
          return [];
        }

        // Връщаме запазените платежни методи от потребителския документ
        return userData.paymentMethods || [];
      } catch (error) {
        throw new Error('Грешка при получаване на платежни методи');
      }
    }
  },

  Mutation: {
    createPaymentIntent: async (
      _: unknown,
      { input }: { input: { amount: number; type: PaymentType; description?: string; campaignId?: string; initiativeId?: string } },
      context: ContextType
    ) => {
      const user = checkAuth(context);

      try {
        console.log('Creating payment intent for user:', user.id, 'amount:', input.amount, 'type:', input.type);

        // Вземаме имейла на потребителя за касова бележка
        const userDoc = await User.findById(user.id);
        const receiptEmail = userDoc?.email;

        // Базовите метаданни
        const baseMetadata: Record<string, string> = {
          userId: user.id,
          type: input.type
        };

        // Добавяме campaignId ако е подаден
        if (input.campaignId) {
          baseMetadata.campaignId = input.campaignId;
        }

        // Добавяме initiativeId ако е подаден
        if (input.initiativeId) {
          baseMetadata.initiativeId = input.initiativeId;
        }

        console.log('Payment intent metadata:', baseMetadata);

        // Създаваме PaymentIntent чрез Stripe
        const paymentIntent = await stripeService.createPaymentIntent({
          amount: Math.round(input.amount * 100), // Конвертиране на левове в стотинки
          currency: 'bgn',
          description: input.description,
          metadata: baseMetadata,
          receiptEmail: receiptEmail,
        });

        console.log('PaymentIntent created:', paymentIntent.id);

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: input.amount,
          currency: 'bgn',
        };
      } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error(`Error creating payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    confirmPayment: async (
      _: unknown,
      { paymentIntentId }: { paymentIntentId: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);

      try {
        // Проверяваме дали плащането вече е записано (идемпотентност)
        const existingPayment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        if (existingPayment) {
          return existingPayment;
        }

        // Вземаме данни за PaymentIntent от Stripe
        const stripePaymentIntent = await stripeService.getPaymentIntent(paymentIntentId);
        
        if (!stripePaymentIntent) {
          throw new Error('Платежното намерение не е намерено');
        }

        // Проверяваме дали плащането е успешно
        if (stripePaymentIntent.status !== 'succeeded') {
          throw new Error(`Плащането не е успешно: ${stripePaymentIntent.status}`);
        }

        const metadata = stripePaymentIntent.metadata || {};
        
        // Създаване на данни за платежния документ
        const paymentData: PaymentData = {
          stripePaymentIntentId: paymentIntentId,
          amount: stripePaymentIntent.amount / 100, // Конвертиране от стотинки към лева
          currency: stripePaymentIntent.currency,
          status: PaymentStatus.SUCCEEDED,
          type: metadata.type as PaymentType || PaymentType.OTHER_DONATION,
          description: stripePaymentIntent.description,
          user: new Types.ObjectId(user.id), // Използваме user.id от контекста
        };

        // Добавяне на свързани обекти според метаданните
        if (metadata.campaignId) {
          paymentData.campaign = new Types.ObjectId(metadata.campaignId);
        }

        if (metadata.initiativeId) {
          paymentData.initiative = new Types.ObjectId(metadata.initiativeId);
        }

        // Обработка на свързаните артикули, ако има такива
        if (metadata.items) {
          const itemIds = metadata.items.split(',');
          paymentData.items = itemIds.map(id => new Types.ObjectId(id));
        }

        // Обработка на донор и обновяване на плащането
        await processDonorAndUpdatePayment(paymentData);

        // Обновяване на кампанията, ако плащането е за кампания
        if (paymentData.campaign && paymentData.user) {
          await updateCampaignWithDonation(paymentData.campaign, paymentData.user, paymentData.amount);
        }

        try {
          // Записваме плащането в базата данни
          const payment = new Payment(paymentData);
          await payment.save();
          
          // Връщаме плащането с популирани данни
          return await Payment.findById(payment._id)
            .populate('user')
            .populate('campaign')
            .populate('initiative')
            .populate('donor');
        } catch (error) {
          throw error;
        }
      } catch (error) {
        console.error('Грешка при потвърждаване на плащане:', error);
        throw new Error(`Грешка при потвърждаване на плащане: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    },

    refundPayment: async (
      _: unknown,
      { paymentIntentId }: { paymentIntentId: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Само администратори могат да правят възстановявания
      checkPermissions(user, UserRole.ADMIN);

      try {
        // Намираме плащането в базата данни
        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!payment) {
          throw new Error('Плащането не е намерено');
        }

        // Проверяваме дали плащането вече е възстановено
        if (payment.status === PaymentStatus.REFUNDED) {
          return payment;
        }

        // Използваме транзакция за записване на промените
        try {
          // Правим заявка към Stripe за възстановяване
          const refund = await stripeService.createRefund(paymentIntentId);
          
          if (!refund || refund.status !== 'succeeded') {
            throw new Error('Възстановяването не беше успешно');
          }

          // Обновяваме статуса на плащането
          payment.status = PaymentStatus.REFUNDED;
          await payment.save();

          // Ако има донор, намаляваме сумата на неговите дарения
          if (payment.donor) {
            const donor = await Donor.findById(payment.donor);
            if (donor) {
              donor.totalDonations -= payment.amount;
              if (donor.totalDonations < 0) {
                donor.totalDonations = 0;
              }
              await donor.save();
            }
          }

          return payment;
        } catch (error) {
          throw error;
        }
      } catch (error) {
        console.error('Грешка при възстановяване на плащане:', error);
        throw new Error(`Грешка при възстановяване на плащане: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    },

    createSetupIntent: async (_: unknown, {}: {}, context: ContextType) => {
      const user = checkAuth(context);

      try {
        // Намиране или създаване на Stripe клиент за потребителя
        const stripeCustomerId = await findOrCreateStripeCustomer(user.id);

        // Създаваме SetupIntent за запазване на платежен метод
        const setupIntent = await stripeService.createSetupIntent({
          customerId: stripeCustomerId,
          metadata: { userId: user.id }
        });

        return {
          clientSecret: setupIntent.client_secret,
          setupIntentId: setupIntent.id
        };
      } catch (error) {
        console.error('Грешка при създаване на setup intent:', error);
        throw new Error(`Грешка при създаване на setup intent: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    },

    savePaymentMethod: async (
      _: unknown,
      { paymentMethodId }: { paymentMethodId: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);

      try {
        // Вземаме потребителя от базата данни
        const userData = await User.findById(user.id);
        if (!userData) {
          throw new Error('Потребителят не е намерен');
        }

        // Проверяваме дали потребителят има Stripe клиент
        if (!userData.stripeCustomerId) {
          // Създаваме Stripe клиент, ако потребителят още няма такъв
          userData.stripeCustomerId = await findOrCreateStripeCustomer(user.id);
        }

        // Получаваме данни за платежния метод от Stripe
        const paymentMethod = await stripeService.getPaymentMethod(paymentMethodId);
        
        // Свързваме платежния метод с клиента
        await stripeService.attachPaymentMethodToCustomer(paymentMethodId, userData.stripeCustomerId);

        // Проверка дали този платежен метод вече е запазен и дали има card свойство
        const existingMethod = userData.paymentMethods?.find(pm => pm.paymentMethodId === paymentMethodId);
        const card = paymentMethod.card;
        
        if (!existingMethod && card) {
          // Добавяме платежния метод към потребителя
          const newPaymentMethod = {
            paymentMethodId: paymentMethod.id,
            brand: card.brand,
            last4: card.last4,
            expMonth: card.exp_month,
            expYear: card.exp_year,
            isDefault: !userData.paymentMethods || userData.paymentMethods.length === 0
          };

          if (!userData.paymentMethods) {
            userData.paymentMethods = [];
          }

          userData.paymentMethods.push(newPaymentMethod);
          await userData.save();
        }

        return true;
      } catch (error) {
        console.error('Грешка при запазване на платежен метод:', error);
        throw new Error(`Грешка при запазване на платежен метод: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    },

    removePaymentMethod: async (
      _: unknown,
      { paymentMethodId }: { paymentMethodId: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);

      try {
        // Вземаме потребителя от базата данни
        const userData = await User.findById(user.id);
        if (!userData) {
          throw new Error('Потребителят не е намерен');
        }

        // Проверяваме дали потребителят има платежни методи
        if (!userData.paymentMethods || userData.paymentMethods.length === 0) {
          throw new Error('Няма запазени платежни методи');
        }

        // Проверяваме дали методът съществува
        const methodExists = userData.paymentMethods.some(pm => pm.paymentMethodId === paymentMethodId);
        if (!methodExists) {
          return true; // Методът вече е премахнат - идемпотентно поведение
        }

        // Премахваме платежния метод от Stripe
        await stripeService.detachPaymentMethod(paymentMethodId);

        // Премахваме платежния метод от потребителя
        userData.paymentMethods = userData.paymentMethods.filter(
          pm => pm.paymentMethodId !== paymentMethodId
        );

        // Ако сме премахнали метода по подразбиране и имаме други методи, задаваме първия като такъв
        if (userData.paymentMethods.length > 0 && !userData.paymentMethods.some(pm => pm.isDefault)) {
          userData.paymentMethods[0].isDefault = true;
        }

        await userData.save();
        return true;
      } catch (error) {
        console.error('Грешка при премахване на платежен метод:', error);
        throw new Error(`Грешка при премахване на платежен метод: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    },

    setDefaultPaymentMethod: async (
      _: unknown,
      { paymentMethodId }: { paymentMethodId: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);

      try {
        // Вземаме потребителя от базата данни
        const userData = await User.findById(user.id);
        if (!userData) {
          throw new Error('Потребителят не е намерен');
        }

        // Проверяваме дали потребителят има платежни методи
        if (!userData.paymentMethods || userData.paymentMethods.length === 0) {
          throw new Error('Няма запазени платежни методи');
        }

        // Проверяваме дали платежният метод съществува
        const methodExists = userData.paymentMethods.some(pm => pm.paymentMethodId === paymentMethodId);
        if (!methodExists) {
          throw new Error('Платежният метод не е намерен');
        }

        // Обновяваме флага isDefault за всички методи
        userData.paymentMethods.forEach(pm => {
          pm.isDefault = (pm.paymentMethodId === paymentMethodId);
        });

        // Настройваме метода по подразбиране в Stripe
        if (userData.stripeCustomerId) {
          await stripeService.setDefaultPaymentMethod(userData.stripeCustomerId, paymentMethodId);
        }

        await userData.save();
        return true;
      } catch (error) {
        console.error('Грешка при задаване на платежен метод по подразбиране:', error);
        throw new Error(`Грешка при задаване на платежен метод по подразбиране: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    }
  },

  // Resolver за връзки между типовете
  Payment: {
    campaign: async (parent: any) => {
      if (!parent.campaign) return null;
      return await Campaign.findById(parent.campaign);
    },
    initiative: async (parent: any) => {
      if (!parent.initiative) return null;
      return await Initiative.findById(parent.initiative);
    },
    items: async (parent: any) => {
      if (!parent.items || parent.items.length === 0) return [];
      return await StoreItem.find({ _id: { $in: parent.items } });
    },
    donor: async (parent: any) => {
      if (!parent.donor) return null;
      return await Donor.findById(parent.donor);
    },
    user: async (parent: any) => {
      if (!parent.user) return null;
      return await User.findById(parent.user);
    }
  }
}; 