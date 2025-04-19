import dotenv from "dotenv";
import { UserInputError } from "../utils/errors";
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

dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_SIGNIN_CLIENT_ID);

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
        // Find user by email
        const user = await User.findOne({ email: input.email }).select(
          "+password"
        );
        if (!user) {
          // Запис на неуспешен опит
          await logLoginAttempt(
            "unknown", 
            context.req.ip || "unknown", 
            context.req.headers['user-agent'] || "unknown",
            "failed"
          );
          throw new UserInputError("Invalid email or password");
        }

        // Check password
        const isMatch = await user.comparePassword(input.password);
        if (!isMatch) {
          // Запис на неуспешен опит
          await logLoginAttempt(
            user._id.toString(), 
            context.req.ip || "unknown", 
            context.req.headers['user-agent'] || "unknown",
            "failed"
          );
          throw new UserInputError("Invalid email or password");
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
        
        // Запис на успешен опит
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
          throw new Error(`Login error: ${err.message}`);
        }
        throw new Error("Unexpected error during login");
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
          await invalidateRefreshToken(refreshToken);
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
        
        const success = await invalidateRefreshToken(refreshToken);
        
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
  },
};
