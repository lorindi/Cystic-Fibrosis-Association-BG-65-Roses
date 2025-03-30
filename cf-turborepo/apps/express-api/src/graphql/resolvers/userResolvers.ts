import { UserInputError } from 'apollo-server-express';
import { UserRole, UserGroup } from '../../types/user.types';
import User from '../../models/user.model';
import { ContextType, checkAuth, checkPermissions, generateToken } from '../utils/auth';
import { sendVerificationEmail } from '../../services/emailService';
import crypto from 'crypto';

export const userResolvers = {
  Query: {
    getCurrentUser: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      try {
        return await User.findById(user.id);
      } catch (err) {
        throw new Error('Error fetching user');
      }
    },
    
    getUser: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      try {
        return await User.findById(id);
      } catch (err) {
        throw new Error('User not found');
      }
    },
    
    getUsers: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      // Only admins can see all users
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        return await User.find();
      } catch (err) {
        throw new Error('Error fetching users');
      }
    },
    
    getUsersByRole: async (_: unknown, { role }: { role: UserRole }, context: ContextType) => {
      const user = checkAuth(context);
      // Only admins can filter users by role
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        return await User.find({ role });
      } catch (err) {
        throw new Error('Error fetching users');
      }
    },
    
    getUsersByGroup: async (_: unknown, { group }: { group: UserGroup }, context: ContextType) => {
      const user = checkAuth(context);
      // Only admins can filter users by group
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        return await User.find({ groups: group });
      } catch (err) {
        throw new Error('Error fetching users');
      }
    },
  },

  Mutation: {
    register: async (_: unknown, { input }: { input: { name: string; email: string; password: string } }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new UserInputError('User with this email already exists');
        }
        
        // Create new user
        const newUser = new User({
          name: input.name,
          email: input.email,
          password: input.password, // Password will be hashed in pre-save hook
          // Проверка дали имейлът е посоченият - ако да, задава роля админ
          role: input.email === process.env.ADMIN_EMAIL ? UserRole.ADMIN : UserRole.DONOR,
          isEmailVerified: false
        });
        
        // Генериране на токен за потвърждение на имейла
        const verificationToken = newUser.generateEmailVerificationToken();
        
        // Save user
        const savedUser = await newUser.save();
        
        // Generate token for auth
        const token = generateToken(savedUser);
        
        // Изпращане на имейл за потвърждение (асинхронно, не блокира регистрацията)
        try {
          const emailSent = await sendVerificationEmail(
            savedUser.email,
            savedUser.name,
            verificationToken
          );
          
          if (emailSent) {
            console.log('Verification email sent successfully to:', savedUser.email);
          } else {
            console.error('Failed to send verification email to:', savedUser.email);
          }
        } catch (emailError) {
          console.error('Error in email sending process:', emailError);
        }
        
        return {
          token,
          user: savedUser
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Registration error: ${err.message}`);
        }
        throw new Error('Unexpected error during registration');
      }
    },
    resendVerificationEmail: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const userData = await User.findById(user.id);
        if (!userData) {
          throw new Error('User not found');
        }
        
        if (userData.isEmailVerified) {
          throw new Error('Email is already verified');
        }
        
        // Генериране на нов токен за потвърждение
        const verificationToken = userData.generateEmailVerificationToken();
        await userData.save();
        
        // Изпращане на имейл за потвърждение
        const emailSent = await sendVerificationEmail(
          userData.email,
          userData.name,
          verificationToken
        );
        
        if (!emailSent) {
          throw new Error('Failed to send verification email');
        }
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error resending verification email: ${err.message}`);
        }
        throw new Error('Unexpected error during email verification resend');
      }
    },
    
    verifyEmail: async (_: unknown, { token }: { token: string }) => {
      try {
        // Хеширане на токена за сравнение
        const hashedToken = crypto
          .createHash('sha256')
          .update(token)
          .digest('hex');
        
        // Търсене на потребител с този токен и валиден период на експирация
        const user = await User.findOne({
          emailVerificationToken: hashedToken,
          emailVerificationExpires: { $gt: Date.now() }
        });
        
        if (!user) {
          return {
            success: false,
            message: 'Invalid or expired verification token',
            user: null
          };
        }
        
        // Актуализиране на потребителя като потвърден
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        
        await user.save();
        
        // Генериране на нов токен след успешна верификация
        const authToken = generateToken(user);
        
        return {
          success: true,
          message: 'Email verified successfully',
          user: user,
          token: authToken // Добавяме нов JWT токен за автоматично логване
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Email verification error:", err);
          return {
            success: false,
            message: `Error verifying email: ${err.message}`,
            user: null
          };
        }
        return {
          success: false,
          message: 'Unexpected error during email verification',
          user: null
        };
      }
    },

    login: async (_: unknown, { input }: { input: { email: string; password: string } }) => {
      try {
        // Find user by email
        const user = await User.findOne({ email: input.email }).select('+password');
        if (!user) {
          throw new UserInputError('Invalid email or password');
        }
        
        // Check password
        const isMatch = await user.comparePassword(input.password);
        if (!isMatch) {
          throw new UserInputError('Invalid email or password');
        }
        
        // Generate token
        const token = generateToken(user);
        
        return {
          token,
          user
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Login error: ${err.message}`);
        }
        throw new Error('Unexpected error during login');
      }
    },
    
    updateProfile: async (_: unknown, { input }: { input: unknown }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { profile: input },
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating profile: ${err.message}`);
        }
        throw new Error('Unexpected error during profile update');
      }
    },
    
    setUserRole: async (
      _: unknown, 
      { userId, role }: { userId: string; role: UserRole }, 
      context: ContextType
    ) => {
      const currentUser = checkAuth(context);
      // Only admins can change user roles
      checkPermissions(currentUser, UserRole.ADMIN);
      
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true, runValidators: true }
        );
        
        if (!user) {
          throw new Error('User not found');
        }
        
        return user;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error changing role: ${err.message}`);
        }
        throw new Error('Unexpected error during role change');
      }
    },
    
    addUserToGroup: async (
      _: unknown, 
      { userId, group }: { userId: string; group: UserGroup }, 
      context: ContextType
    ) => {
      const currentUser = checkAuth(context);
      // Only admins can add users to groups
      checkPermissions(currentUser, UserRole.ADMIN);
      
      try {
        const user = await User.findById(userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Check if user already in group
        if (user.groups && user.groups.includes(group)) {
          return user; // User already in group, return user
        }
        
        // Add to group
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { groups: group } },
          { new: true, runValidators: true }
        );
        
        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error adding to group: ${err.message}`);
        }
        throw new Error('Unexpected error during group addition');
      }
    },
    
    removeUserFromGroup: async (
      _: unknown, 
      { userId, group }: { userId: string; group: UserGroup }, 
      context: ContextType
    ) => {
      const currentUser = checkAuth(context);
      // Only admins can remove users from groups
      checkPermissions(currentUser, UserRole.ADMIN);
      
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { groups: group } },
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error removing from group: ${err.message}`);
        }
        throw new Error('Unexpected error during group removal');
      }
    },
  },
}; 