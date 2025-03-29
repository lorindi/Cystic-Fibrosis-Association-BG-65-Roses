import mongoose, { Schema } from 'mongoose';
import { 
  IStoreItemDocument, 
  IDonorDocument, 
  IDonationDocument 
} from '../types/store.types';

// Модел за артикулите в магазина
const StoreItemSchema = new Schema<IStoreItemDocument>({
  name: { 
    type: String, 
    required: [true, 'The name is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'The description is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'The price is required'],
    min: [0.01, 'The price must be a positive value']
  },
  image: { 
    type: String
  },
  category: { 
    type: String, 
    required: [true, 'The category is required'],
    enum: [
      'research',
      'psychological_support',
      'medication',
      'medical_equipment',
      'other'
    ]
  },
  available: { 
    type: Boolean, 
    default: true
  }
}, {
  timestamps: true
});

// Индекси за артикулите
StoreItemSchema.index({ category: 1 });
StoreItemSchema.index({ price: 1 });
StoreItemSchema.index({ available: 1 });

// Модел за благодетели
const DonorSchema = new Schema<IDonorDocument>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  name: { 
    type: String, 
    required: [true, 'The name is required'],
    trim: true
  },
  description: { 
    type: String 
  },
  logo: { 
    type: String 
  },
  website: { 
    type: String 
  },
  totalDonations: { 
    type: Number, 
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Индекси за благодетели
DonorSchema.index({ totalDonations: -1 });
DonorSchema.index({ user: 1 });

// Модел за дарения
const DonationSchema = new Schema<IDonationDocument>({
  amount: { 
    type: Number, 
    required: [true, 'The amount is required'],
    min: [0.01, 'The amount must be a positive value']
  },
  donor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Donor',
    required: true
  },
  campaign: { 
    type: Schema.Types.ObjectId, 
    ref: 'Campaign'
  },
  items: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'StoreItem'
  }],
  date: { 
    type: Date, 
    default: Date.now
  }
});

// Индекси за дарения
DonationSchema.index({ donor: 1 });
DonationSchema.index({ campaign: 1 });
DonationSchema.index({ date: -1 });

// Hook за обновяване на общата сума на дарения за донора
DonationSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      // Добавяне на сумата към общата сума на донора
      await mongoose.model('Donor').findByIdAndUpdate(this.donor, {
        $inc: { totalDonations: this.amount }
      });
      
      // Ако дарението е за кампания, обновяване на текущата сума
      if (this.campaign) {
        await mongoose.model('Campaign').findByIdAndUpdate(this.campaign, {
          $inc: { currentAmount: this.amount }
        });
      }
    }
    
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(new Error(error.message));
    } else {
      next(new Error('Unknown error occurred'));
    }
  }
});

// Създаване на моделите
const StoreItem = mongoose.model<IStoreItemDocument>('StoreItem', StoreItemSchema);
const Donor = mongoose.model<IDonorDocument>('Donor', DonorSchema);
const Donation = mongoose.model<IDonationDocument>('Donation', DonationSchema);

export { StoreItem, Donor, Donation }; 