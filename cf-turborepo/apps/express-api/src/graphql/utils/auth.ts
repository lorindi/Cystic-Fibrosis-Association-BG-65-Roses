import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { UserRole, UserGroup, IUserDocument } from '../../types/user.types';

// Utility функции
export const generateToken = (user: IUserDocument): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1d' }
  );
};

export interface ContextType {
  req: {
    headers: {
      authorization?: string;
    };
  };
}

// Auth middleware
export const checkAuth = (context: ContextType) => {
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
export const checkPermissions = (
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