import dotenv from "dotenv";
import { UserInputError, AuthenticationError } from "../utils/errors";
import { UserRole, UserGroup } from "../../types/user.types";
import User from "../../models/user.model";
import {
  ContextType,
  checkAuth,
  checkPermissions,
  generateToken,
  generateRefreshToken,
  useRefreshToken,
  invalidateRefreshToken,
  invalidateAllRefreshTokens,
  logLoginAttempt
} from "../utils/auth";
import { sendVerificationEmail } from "../../services/emailService";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import LoginHistory from "../../models/loginHistory.model";
import RefreshToken from "../../models/refreshToken.model";
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_SIGNIN_CLIENT_ID);

// Помощна функция за валидация на refresh токен
const validateRefreshToken = async (token: string) => {
  try {
    // Намираме токена в базата данни
    const refreshToken = await RefreshToken.findOne({ token, isValid: true }).populate('userId');
    
    if (!refreshToken) {
      throw new AuthenticationError('Invalid refresh token');
    }
    
    // Проверяваме дали токенът не е изтекъл
    if (refreshToken.expires < new Date()) {
      // Невалидираме токена в базата данни
      await RefreshToken.findOneAndUpdate(
        { token },
        { $set: { isValid: false } }
      );
      throw new AuthenticationError('Refresh token expired');
    }
    
    return refreshToken;
  } catch (error) {
    throw error;
  }
};

// Функция за невалидиране на refresh токен
async function invalidateTokenFunc(token: string) {
  try {
    await RefreshToken.findOneAndUpdate(
      { token },
      { $set: { isValid: false } }
    );
    return true;
  } catch (error) {
    console.error('Error invalidating refresh token:', error);
    return false;
  }
}

export const userResolvers = {
  Query: {
    getCurrentUser: async (_: unknown, __: unknown, context: ContextType) => {
      const user = checkAuth(context);
      try {
        return await User.findById(user.id);
      } catch (err) {
        throw new Error("Error fetching user");
      }
    },

    getUser: async (
      _: unknown,
      { id }: { id: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      try {
        return await User.findById(id);
      } catch (err) {
        throw new Error("User not found");
      }
    },

    getUsers: async (
      _: unknown, 
      { limit, offset, noLimit }: { limit?: number; offset?: number; noLimit?: boolean },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Only admins can see all users
      checkPermissions(user, UserRole.ADMIN);

      try {
        let query = User.find();
        
        // Прилагаме пагинация, само ако са зададени параметри и noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
        
        return await query;
      } catch (err) {
        throw new Error("Error fetching users");
      }
    },
    
    getPaginatedUsers: async (
      _: unknown,
      { limit = 10, offset = 0, noLimit = false }: { limit?: number; offset?: number; noLimit?: boolean },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Only admins can see all users
      checkPermissions(user, UserRole.ADMIN);

      try {
        // Изпълняваме две заявки - една за общия брой и една за данните с пагинация
        const totalCount = await User.countDocuments();
        
        let query = User.find();
        
        // Ако noLimit е false, прилагаме стандартна пагинация
        if (!noLimit) {
          query = query.skip(offset).limit(limit + 1); // +1 за да проверим дали има още
        }
        
        const users = await query;
        
        // Проверяваме дали има още страници само ако не е поискан целият списък
        const hasMore = !noLimit ? users.length > limit : false;
        
        // Връщаме само исканите потребители или всички, ако noLimit е true
        return {
          users: noLimit ? users : users.slice(0, limit),
          totalCount,
          hasMore
        };
      } catch (err) {
        throw new Error("Error fetching paginated users");
      }
    },

    getUsersByRole: async (
      _: unknown,
      { role, limit, offset, noLimit }: { role: UserRole; limit?: number; offset?: number; noLimit?: boolean },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Only admins can filter users by role
      checkPermissions(user, UserRole.ADMIN);

      try {
        let query = User.find({ role });
        
        // Прилагаме пагинация, само ако са зададени параметри и noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
        
        return await query;
      } catch (err) {
        throw new Error("Error fetching users");
      }
    },

    getUsersByGroup: async (
      _: unknown,
      { group, limit, offset, noLimit }: { group: UserGroup; limit?: number; offset?: number; noLimit?: boolean },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Only admins can filter users by group
      checkPermissions(user, UserRole.ADMIN);

      try {
        let query = User.find({ groups: group });
        
        // Прилагаме пагинация, само ако са зададени параметри и noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
        
        return await query;
      } catch (err) {
        throw new Error("Error fetching users");
      }
    },

    getUserSessions: async (_: unknown, __: unknown, context: ContextType) => {
      try {
        const user = checkAuth(context);
        
        const sessions = await RefreshToken.find({ 
          userId: user.id,
          isValid: true,
          expires: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        
        return sessions.map(session => ({
          id: session._id,
          ip: session.ip,
          userAgent: session.userAgent,
          createdAt: session.createdAt,
          expiresAt: session.expires
        }));
      } catch (error) {
        console.error("Get user sessions error:", error);
        throw new Error("Failed to get user sessions");
      }
    },

    getLoginHistory: async (_: unknown, { limit = 10 }: { limit: number }, context: ContextType) => {
      try {
        const user = checkAuth(context);
        
        const history = await LoginHistory.find({ 
          userId: user.id
        })
        .sort({ loggedInAt: -1 })
        .limit(limit);
        
        return history.map(entry => ({
          id: entry._id,
          ip: entry.ip,
          userAgent: entry.userAgent,
          status: entry.status,
          loggedInAt: entry.loggedInAt
        }));
      } catch (error) {
        console.error("Get login history error:", error);
        throw new Error("Failed to get login history");
      }
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } },
      context: ContextType
    ) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new UserInputError("User with this email already exists");
        }

        // Create new user
        const newUser = new User({
          name: input.name,
          email: input.email,
          password: input.password, // Password will be hashed in pre-save hook
          // Проверка дали имейлът е посоченият - ако да, задава роля админ
          role:
            input.email === process.env.ADMIN_EMAIL
              ? UserRole.ADMIN
              : UserRole.DONOR,
          isEmailVerified: false,
        });

        // Генериране на токен за потвърждение на имейла
        const verificationToken = newUser.generateEmailVerificationToken();

        // Save user
        const savedUser = await newUser.save();

        // Generate token for auth and set cookie
        const token = generateToken(savedUser, context.res);
        
        // Generate refresh token and set cookie
        await generateRefreshToken(
          savedUser._id.toString(),
          context.req.ip || "unknown",
          context.req.headers['user-agent'] || "unknown",
          context.res
        );
        
        // Запис на успешна регистрация
        await logLoginAttempt(
          savedUser._id.toString(), 
          context.req.ip || "unknown", 
          context.req.headers['user-agent'] || "unknown",
          "success"
        );

        // Изпращане на имейл за потвърждение (асинхронно, не блокира регистрацията)
        try {
          const emailSent = await sendVerificationEmail(
            savedUser.email,
            savedUser.name,
            verificationToken
          );

          if (emailSent) {
            console.log(
              "Verification email sent successfully to:",
              savedUser.email
            );
          } else {
            console.error(
              "Failed to send verification email to:",
              savedUser.email
            );
          }
        } catch (emailError) {
          console.error("Error in email sending process:", emailError);
        }

        return {
          token,
          user: savedUser,
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Registration error: ${err.message}`);
        }
        throw new Error("Unexpected error during registration");
      }
    },
    resendVerificationEmail: async (
      _: unknown,
      __: unknown,
      context: ContextType
    ) => {
      const user = checkAuth(context);

      try {
        const userData = await User.findById(user.id);
        if (!userData) {
          throw new Error("User not found");
        }

        if (userData.isEmailVerified) {
          throw new Error("Email is already verified");
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
          throw new Error("Failed to send verification email");
        }

        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error resending verification email: ${err.message}`);
        }
        throw new Error("Unexpected error during email verification resend");
      }
    },

    verifyEmail: async (_: unknown, { token }: { token: string }, context: ContextType) => {
      try {
        // Хеширане на токена за сравнение
        const hashedToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        // Търсене на потребител с този токен и валиден период на експирация
        const user = await User.findOne({
          emailVerificationToken: hashedToken,
          emailVerificationExpires: { $gt: Date.now() },
        });

        if (!user) {
          return {
            success: false,
            message: "Invalid or expired verification token",
            user: null,
          };
        }

        // Актуализиране на потребителя като потвърден
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        // Генериране на нов токен след успешна верификация и задаване на бисквитка
        const authToken = generateToken(user, context.res);
        
        // Generate refresh token and set cookie
        await generateRefreshToken(
          user._id.toString(),
          context.req.ip || "unknown",
          context.req.headers['user-agent'] || "unknown",
          context.res
        );
        
        // Запис на логин след верификация
        await logLoginAttempt(
          user._id.toString(), 
          context.req.ip || "unknown", 
          context.req.headers['user-agent'] || "unknown",
          "success"
        );

        return {
          success: true,
          message: "Email verified successfully",
          user: user,
          token: authToken, // Добавяме нов JWT токен за автоматично логване
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Email verification error:", err);
          return {
            success: false,
            message: `Error verifying email: ${err.message}`,
            user: null,
          };
        }
        return {
          success: false,
          message: "Unexpected error during email verification",
          user: null,
        };
      }
    },

    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } },
      context: ContextType
    ) => {
      try {
        // Намираме потребителя по имейл
        const user = await User.findOne({ email: input.email }).select('+password');
        
        // Проверяваме дали потребителят съществува
        if (!user) {
          throw new AuthenticationError('Невалиден имейл или парола');
        }
        
        // Проверяваме дали акаунтът е активен
        if (!user.isActive) {
          throw new AuthenticationError('Профилът е деактивиран. Моля, свържете се с администратор за повторно активиране.');
        }
        
        // Проверяваме дали паролата е правилна
        const isMatch = await user.comparePassword(input.password);
        if (!isMatch) {
          // Запис на неуспешен опит за вход
          await LoginHistory.create({
            userId: user._id,
            ip: context.req.ip,
            userAgent: context.req.headers['user-agent'],
            status: 'failed',
            loggedInAt: new Date()
          });
          
          throw new AuthenticationError('Невалиден имейл или парола');
        }
        
        // Генерираме JWT токен
        const token = generateToken(user, context.res);
        
        // Generate refresh token and set cookie
        await generateRefreshToken(
          user._id.toString(),
          context.req.ip || "unknown",
          context.req.headers['user-agent'] || "unknown",
          context.res
        );
        
        // Запис на успешно логване
        await LoginHistory.create({
          userId: user._id,
          ip: context.req.ip || "unknown",
          userAgent: context.req.headers['user-agent'] || "unknown",
          status: 'success',
          loggedInAt: new Date()
        });
        
        // Правим безопасно копие на данните без паролата
        const { password, ...userWithoutPassword } = user.toObject();
        
        return {
          token,
          user: userWithoutPassword,
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Login error: ${err.message}`);
        }
        throw new Error('Unexpected error during login');
      }
    },

    logout: async (_: unknown, __: unknown, context: ContextType) => {
      try {
        // Изтриваме JWT cookie
        context.res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
        });
        
        // Изтриваме и рефреш токена от cookies
        context.res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
        });
        
        // Инвалидираме рефреш токена в базата, ако съществува
        const refreshToken = context.req.cookies?.refreshToken;
        if (refreshToken) {
          await invalidateTokenFunc(refreshToken);
        }
        
        return true;
      } catch (error) {
        console.error("Logout error:", error);
        return false;
      }
    },

    updateProfile: async (
      _: unknown,
      { input }: { input: unknown },
      context: ContextType
    ) => {
      const user = checkAuth(context);

      try {
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { profile: input },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating profile: ${err.message}`);
        }
        throw new Error("Unexpected error during profile update");
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
        // Първо намираме потребителя, за да проверим текущата му роля
        const existingUser = await User.findById(userId);
        
        if (!existingUser) {
          throw new Error("User not found");
        }
        
        // Проверка дали потребителят вече е администратор
        if (existingUser.role === UserRole.ADMIN) {
          throw new Error("Administrator roles cannot be changed. This is a security measure.");
        }
        
        // Актуализираме ролята на потребителя
        const user = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true, runValidators: true }
        );

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error changing role: ${err.message}`);
        }
        throw new Error("Unexpected error during role change");
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
          throw new Error("User not found");
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
        throw new Error("Unexpected error during group addition");
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
          throw new Error("User not found");
        }

        return updatedUser;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error removing from group: ${err.message}`);
        }
        throw new Error("Unexpected error during group removal");
      }
    },

    googleAuth: async (
      _: unknown,
      { input }: { input: { idToken: string } },
      context: ContextType
    ) => {
      try {
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
          idToken: input.idToken,
          audience: process.env.GOOGLE_SIGNIN_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("Invalid Google token");
        }

        const { email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
          // Create new user if doesn't exist
          user = new User({
            name,
            email,
            password: crypto.randomBytes(20).toString("hex"), // Generate random password
            role:
              email === process.env.ADMIN_EMAIL
                ? UserRole.ADMIN
                : UserRole.DONOR,
            isEmailVerified: true, // Google emails are already verified
            profile: {
              avatar: picture,
            },
          });

          await user.save();
        }

        // Generate JWT token and set cookie
        const token = generateToken(user, context.res);
        
        // Generate refresh token and set cookie
        await generateRefreshToken(
          user._id.toString(),
          context.req.ip || "unknown",
          context.req.headers['user-agent'] || "unknown",
          context.res
        );
        
        // Запис на успешно логване
        await logLoginAttempt(
          user._id.toString(), 
          context.req.ip || "unknown", 
          context.req.headers['user-agent'] || "unknown",
          "success"
        );

        return {
          token,
          user,
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Google authentication error: ${err.message}`);
        }
        throw new Error("Unexpected error during Google authentication");
      }
    },

    refreshToken: async (_: unknown, __: unknown, context: ContextType) => {
      try {
        const refreshToken = context.req.cookies?.refreshToken;
        if (!refreshToken) {
          throw new Error("No refresh token provided");
        }
        
        // Валидиране на рефреш токена и получаване на потребителски ID
        const userId = await useRefreshToken(
          refreshToken,
          context.req.ip || "unknown",
          context.req.headers['user-agent'] || "unknown"
        );
        
        if (!userId) {
          throw new Error("Invalid or expired refresh token");
        }
        
        // Намиране на потребителя
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        
        // Генериране на нов JWT токен
        const token = generateToken(user, context.res);
        
        return {
          token,
          user
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Refresh token error: ${error.message}`);
        }
        throw new Error("Unexpected error during refresh token operation");
      }
    },

    invalidateToken: async (_: unknown, __: unknown, context: ContextType) => {
      try {
        const user = checkAuth(context);
        const refreshToken = context.req.cookies?.refreshToken;
        
        if (!refreshToken) {
          return false;
        }
        
        const success = await invalidateTokenFunc(refreshToken);
        
        // Изтриваме и рефреш токена от cookies
        context.res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
        });
        
        return success;
      } catch (error) {
        console.error("Invalidate token error:", error);
        return false;
      }
    },

    invalidateAllTokens: async (_: unknown, __: unknown, context: ContextType) => {
      try {
        const user = checkAuth(context);
        const success = await invalidateAllRefreshTokens(user.id);
        
        // Изтриваме и текущия рефреш токен от cookies
        context.res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
        });
        
        return success;
      } catch (error) {
        console.error("Invalidate all tokens error:", error);
        return false;
      }
    },

    deactivateAccount: async (
      _: unknown,
      { input }: { input?: { reason?: string; feedback?: string } },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        // Намираме потребителя в базата
        const userData = await User.findById(user.id);
        
        if (!userData) {
          throw new Error('Потребителят не е намерен');
        }
        
        // Проверка дали потребителят е администратор
        if (userData.role === UserRole.ADMIN) {
          throw new Error('Администраторски акаунт не може да бъде деактивиран. Моля, първо понижете ролята на потребителя.');
        }
        
        // Деактивираме профила
        userData.isActive = false;
        userData.deactivatedAt = new Date();
        
        if (input?.reason) {
          userData.deactivationReason = input.reason;
        }
        
        // Съхраняваме обратна връзка, ако е предоставена (може да се запише в отделен модел)
        if (input?.feedback) {
          console.log('Обратна връзка при деактивиране на профил:', input.feedback);
          // Тук може да добавите логика за записване на обратната връзка
        }
        
        // Инвалидираме всички сесии и рефреш токени
        await RefreshToken.updateMany(
          { userId: user.id },
          { $set: { isValid: false } }
        );
        
        // Запазваме промените
        await userData.save();
        
        // Изчистваме cookie-та
        context.res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
        });
        
        context.res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
        });
        
        return true;
      } catch (error) {
        console.error('Грешка при деактивиране на профил:', error);
        throw new Error(`Не успяхме да деактивираме профила: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    },
    
    reactivateAccount: async (
      _: unknown,
      { userId }: { userId: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Само администратори могат да реактивират профили
      checkPermissions(user, UserRole.ADMIN);
      
      try {
        // Намираме потребителя за реактивиране
        const userToReactivate = await User.findById(userId);
        
        if (!userToReactivate) {
          throw new Error('Потребителят не е намерен');
        }
        
        // Активираме профила отново
        userToReactivate.isActive = true;
        userToReactivate.deactivatedAt = undefined;
        userToReactivate.deactivationReason = undefined;
        
        // Запазваме промените
        await userToReactivate.save();
        
        return true;
      } catch (error) {
        console.error('Грешка при реактивиране на профил:', error);
        throw new Error(`Не успяхме да реактивираме профила: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`);
      }
    }
  },
};
