import { AuthenticationError, UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRole, UserGroup, IUserDocument } from '../types/user.types';
import User from '../models/user.model';

// Utility functions
const generateToken = (user: IUserDocument): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1d' }
  );
};

interface ContextType {
  req: {
    headers: {
      authorization?: string;
    };
  };
}

// Auth middleware
const checkAuth = (context: ContextType) => {
  const authHeader = context.req.headers.authorization;
  
  if (!authHeader) {
    throw new AuthenticationError('Token is not provided');
  }
  
  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    throw new AuthenticationError('Invalid token format. Use: Bearer [token]');
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    return user as jwt.JwtPayload & { id: string; role: UserRole };
  } catch (err) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

// Check permissions 
const checkPermissions = (
  user: { id: string; role: UserRole; groups?: UserGroup[] }, 
  requiredRole?: UserRole, 
  requiredGroup: UserGroup | null = null
) => {
  // Admins have access to everything
  if (user.role === UserRole.ADMIN) return true;
  
  // Check role
  if (requiredRole && user.role !== requiredRole) {
    throw new AuthenticationError('You do not have the necessary rights for this operation');
  }
  
  // Check group
  if (requiredGroup && (!user.groups || !user.groups.includes(requiredGroup))) {
    throw new AuthenticationError(`You do not have access to the group "${requiredGroup}"`);
  }
  
  return true;
};

export const resolvers = {
  // Date scalar type
  Date: {
    __parseValue(value: unknown) {
      return new Date(value as string | number);
    },
    __serialize(value: Date) {
      return value.toISOString();
    },
  },
  
  Query: {
    // User queries
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
    }
    
    // Тук ще добавим останалите query резолвери за другите типове данни
  },
  
  Mutation: {
    // Authentication mutations
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
          role: UserRole.DONOR, // Default role = дарител
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
    }
    
    // Тук ще добавим останалите mutation резолвери за другите типове данни
  },
  
  Subscription: {
    messageSent: {
      subscribe: (_: unknown, { roomId, userId }: { roomId?: string, userId?: string }) => {
        // Тук ще се имплементира логиката за абонирането за съобщения
        // Ще използваме PubSub механизма на Apollo Server
      }
    }
  }
}; 