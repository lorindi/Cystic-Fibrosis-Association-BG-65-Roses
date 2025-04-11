import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import { Request, Response } from 'express';
import { UserRole, UserGroup, IUserDocument } from '../../types/user.types';

// Създаване на токен
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
    { expiresIn: '7d' }
  );

  // Настройваме HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дни
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
  });

  // Връщаме токена в отговора за съвместимост с текущата клиентска имплементация
  return token;
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
    const user = jwt.verify(token, process.env.JWT_SECRET || 'somesupersecretkey') as {
      id: string;
      email: string;
      role: string;
      groups: string[];
    };
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
    };
    cookies?: {
      token?: string;
    };
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