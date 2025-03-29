import { UserInputError } from 'apollo-server-express';
import { UserRole, UserGroup } from '../../types/user.types';
import User from '../../models/user.model';
import { ContextType, checkAuth, checkPermissions, generateToken } from '../utils/auth';

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
          role: input.email === "loramitova9@gmail.com" ? UserRole.ADMIN : UserRole.DONOR,
          isEmailVerified: false
        });
        
        // Save user
        const savedUser = await newUser.save();
        
        // Generate token
        const token = generateToken(savedUser);
        
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