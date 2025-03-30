import { AuthenticationError } from 'apollo-server-express';
import { UserRole } from '../../types/user.types';
import { StoreItem, Donor, Donation } from '../../models/store.model';
import mongoose from 'mongoose';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const storeResolvers = {
  Query: {
    getStoreItems: async () => {
      try {
        return await StoreItem.find({ available: true }).sort({ category: 1 });
      } catch (err) {
        throw new Error('Error fetching store items');
      }
    },
    
    getStoreItem: async (_: unknown, { id }: { id: string }) => {
      try {
        const item = await StoreItem.findById(id);
        if (!item) {
          throw new Error('Store item not found');
        }
        return item;
      } catch (err) {
        throw new Error('Error fetching store item');
      }
    },
    
    getDonors: async () => {
      try {
        const donors = await Donor.find().sort({ totalDonations: -1 });
        return donors;
      } catch (err) {
        throw new Error('Error fetching donors');
      }
    },
    
    getDonor: async (_: unknown, { id }: { id: string }) => {
      try {
        const donor = await Donor.findById(id);
        if (!donor) {
          throw new Error('Donor not found');
        }
        return donor;
      } catch (err) {
        throw new Error('Error fetching donor');
      }
    },
  },

  Mutation: {
    createStoreItem: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Само администратори могат да създават артикули
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        const newItem = new StoreItem({
          ...input,
          available: true
        });
        
        return await newItem.save();
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating store item: ${err.message}`);
        }
        throw new Error('Unexpected error during store item creation');
      }
    },
    
    updateStoreItem: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Само администратори могат да редактират артикули
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        const item = await StoreItem.findById(id);
        if (!item) {
          throw new Error('Store item not found');
        }
        
        const updatedItem = await StoreItem.findByIdAndUpdate(
          id,
          { ...input },
          { new: true, runValidators: true }
        );
        
        return updatedItem;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating store item: ${err.message}`);
        }
        throw new Error('Unexpected error during store item update');
      }
    },
    
    deleteStoreItem: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Само администратори могат да изтриват артикули
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        const item = await StoreItem.findById(id);
        if (!item) {
          throw new Error('Store item not found');
        }
        
        await StoreItem.findByIdAndDelete(id);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting store item: ${err.message}`);
        }
        throw new Error('Unexpected error during store item deletion');
      }
    },
    
    createDonation: async (
      _: unknown, 
      { input }: { input: { amount: number; campaignId?: string; items?: string[] } }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        // Намиране или създаване на донор
        let donor = await Donor.findOne({ user: user.id });
        
        if (!donor) {
          const userData = await mongoose.model('User').findById(user.id);
          if (!userData) {
            throw new Error('User not found');
          }
          
          donor = new Donor({
            user: user.id,
            name: userData.name,
            totalDonations: 0
          });
          
          await donor.save();
        }
        
        // Създаване на дарение
        const donation = new Donation({
          amount: input.amount,
          donor: donor._id,
          campaign: input.campaignId,
          items: input.items,
          date: new Date()
        });
        
        await donation.save();
        
        return donation;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating donation: ${err.message}`);
        }
        throw new Error('Unexpected error during donation creation');
      }
    },
  },
  
  // Специфични resolver-и за типове
  Donor: {
    donations: async (parent: any) => {
      try {
        return await Donation.find({ donor: parent._id })
          .populate('campaign')
          .populate('items')
          .sort({ date: -1 });
      } catch (err) {
        throw new Error('Error fetching donations');
      }
    }
  }
};