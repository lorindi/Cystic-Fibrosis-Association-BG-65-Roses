import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import { Request, Response } from 'express';
import { UserRole, UserGroup, IUserDocument } from '../../types/user.types';
import RefreshToken from '../../models/refreshToken.model';
import LoginHistory from '../../models/loginHistory.model';
import crypto from 'crypto';

// Типове на токените
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  groups: string[];
}

// Създаване на токен - съкратен живот от 1 час
export const generateToken = (
  user: { _id?: string; id?: string; email: string; role: string; groups: string[] } | IUserDocument,
  res: Response
) => {
  // Извличаме id от _id или id полето
  const userId = 'id' in user && user.id ? user.id : '_id' in user && user._id ? user._id.toString() : '';
  
  const token = jwt.sign(
    { 
      id: userId, 
      email: user.email, 
      role: user.role, 
      groups: Array.isArray(user.groups) ? user.groups : [] 
    },
    process.env.JWT_SECRET || 'somesupersecretkey',
    { expiresIn: '1h' } // Съкратен живот от 1 час
  );

  // Настройваме HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000, // 1 час
    path: '/',
    domain: process.env.COOKIE_DOMAIN || 'localhost'
  });

  // Връщаме токена в отговора за съвместимост с текущата клиентска имплементация
  return token;
};

// Генериране на рефреш токен и съхранение в базата
export const generateRefreshToken = async (
  userId: string, 
  ip: string, 
  userAgent: string,
  res: Response
): Promise<string> => {
  try {
    // Генериране на сигурен рефреш токен
    const refreshToken = crypto.randomBytes(64).toString('hex');
    
    // Задаване на срок на валидност - 7 дни
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // Създаване на записа в базата данни
    await RefreshToken.create({
      token: refreshToken,
      userId,
      ip,
      userAgent,
      isValid: true,
      expires
    });
    
    // Задаване на HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дни
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
    });
    
    return refreshToken;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

// Валидиране и използване на рефреш токен
export const useRefreshToken = async (
  refreshToken: string,
  ip: string,
  userAgent: string
): Promise<string | null> => {
  try {
    // Търсене на токена в базата данни
    const tokenRecord = await RefreshToken.findOne({
      token: refreshToken,
      isValid: true,
      expires: { $gt: new Date() }
    });
    
    if (!tokenRecord) {
      return null;
    }
    
    // Връщаме ID-то на потребителя, за да може да се генерира нов JWT
    return tokenRecord.userId.toString();
  } catch (error) {
    console.error('Error using refresh token:', error);
    return null;
  }
};

// Анулиране на рефреш токени
export const invalidateRefreshToken = async (refreshToken: string): Promise<boolean> => {
  try {
    const result = await RefreshToken.updateOne(
      { token: refreshToken },
      { isValid: false }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error invalidating refresh token:', error);
    return false;
  }
};

// Анулиране на всички рефреш токени на потребител
export const invalidateAllRefreshTokens = async (userId: string): Promise<boolean> => {
  try {
    const result = await RefreshToken.updateMany(
      { userId },
      { isValid: false }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error invalidating all refresh tokens:', error);
    return false;
  }
};

// Запис на история на логванията
export const logLoginAttempt = async (
  userId: string, 
  ip: string, 
  userAgent: string, 
  status: 'success' | 'failed'
): Promise<void> => {
  try {
    await LoginHistory.create({
      userId,
      ip,
      userAgent,
      status,
      loggedInAt: new Date()
    });
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
};

// Проверка на аутентикация
export const checkAuth = (context: ContextType) => {
  // Първо опитваме да вземем токена от cookies
  const tokenFromCookie = context.req.cookies?.token;
  
  // Ако няма cookie, проверяваме в headers за обратна съвместимост
  const authHeader = context.req.headers.authorization;
  const tokenFromHeader = authHeader ? authHeader.split('Bearer ')[1] : null;
  
  // Използваме cookie токена с приоритет, ако е наличен
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    throw new AuthenticationError('Не сте влезли в системата или сесията е изтекла');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'somesupersecretkey') as TokenPayload;
    return user;
  } catch (err) {
    throw new AuthenticationError('Невалиден или изтекъл токен');
  }
};

// Проверка на права за достъп
export const checkPermissions = (
  user: { id: string; role: string; groups: string[] },
  requiredRoles: string | string[] = [],
  requiredGroups: string | string[] = []
) => {
  if (!user) {
    throw new AuthenticationError('Не сте влезли в системата');
  }

  // Конвертираме единична стойност към масив, ако е необходимо
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const groups = Array.isArray(requiredGroups) ? requiredGroups : [requiredGroups];
  
  const hasRequiredRole = roles.length === 0 || roles.includes(user.role);
  const hasRequiredGroup =
    groups.length === 0 ||
    user.groups?.some((group: string) => groups.includes(group));

  if (!hasRequiredRole && !hasRequiredGroup) {
    throw new AuthenticationError('Нямате необходимите права за достъп');
  }

  return true;
};

export interface ContextType {
  req: {
    headers: {
      authorization?: string;
      'user-agent'?: string;
    };
    cookies?: {
      token?: string;
      refreshToken?: string;
    };
    ip?: string;
  };
  res: Response;
}

// Check permissions 
export const checkPermissionsForUser = (
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