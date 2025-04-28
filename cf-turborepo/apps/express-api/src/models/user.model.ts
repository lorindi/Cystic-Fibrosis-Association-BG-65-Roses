import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { IUserDocument, UserRole, UserGroup, IUserMethods } from '../types/user.types';

// Създаваме тип за схемата
type UserSchemaType = mongoose.Schema<IUserDocument>;

const AddressSchema = new Schema({
  city: { type: String, required: true },
  postalCode: { type: String },
  street: { type: String }
}, { _id: false });

const ContactSchema = new Schema({
  phone: { type: String },
  alternativeEmail: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String }
  }
}, { _id: false });

const ProfileSchema = new Schema({
  avatar: { type: String },
  bio: { type: String },
  birthDate: { type: Date },
  address: AddressSchema,
  contact: ContactSchema,
  diagnosed: { type: Boolean }, // For patients
  diagnosisYear: { type: Number }, // For patients
  childName: { type: String }, // For parents
  companyName: { type: String } // For donors
}, { _id: false });

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return the password in queries by default
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.DONOR
  },
  groups: [{
    type: String,
    enum: Object.values(UserGroup)
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  profile: {
    type: ProfileSchema,
    default: {}
  },
  stripeCustomerId: {
    type: String,
    unique: true,
    sparse: true // Позволява null/undefined стойности
  },
  // Запазени платежни методи - само последните 4 цифри и информация за визуализация
  paymentMethods: [{
    paymentMethodId: { type: String },
    brand: { type: String },
    last4: { type: String },
    expMonth: { type: Number },
    expYear: { type: Number },
    isDefault: { type: Boolean, default: false }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
// Забележка: Индексът за email е премахнат, тъй като unique: true в схемата вече създава индекс
// и води до предупреждение за дублиран индекс
UserSchema.index({ role: 1 });
UserSchema.index({ groups: 1 });

// Before saving, hash the password if it has been modified
UserSchema.pre('save', async function(next) {
  // Използваме функционален израз вместо стрелкова функция, за да имаме достъп до 'this'
  // this в този контекст е документът, който се запазва
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method for comparing passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Method for generating password reset token
UserSchema.methods.generatePasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Expires in 1 hour
  this.passwordResetExpires = Date.now() + 3600000;
  
  return resetToken;
};

// Method for generating email verification token
UserSchema.methods.generateEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  // Expires in 24 hours
  this.emailVerificationExpires = Date.now() + 86400000;
  
  return verificationToken;
};

// Method for generating refresh token for a user
UserSchema.methods.generateRefreshToken = async function(ip: string, userAgent: string): Promise<string> {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дни
  
  // Тук използваме импортиран модел динамично, за да избегнем кръгови зависимости
  const RefreshToken = mongoose.model('RefreshToken');
  
  await RefreshToken.create({
    token: refreshToken,
    userId: this._id,
    ip,
    userAgent,
    isValid: true,
    expires
  });
  
  return refreshToken;
};

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;