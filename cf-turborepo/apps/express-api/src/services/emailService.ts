import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// Настройка за превключване между реално изпращане и тестово мокване
const USE_MOCK_EMAIL = process.env.NODE_ENV !== 'production'; // Автоматично използва мок в dev режим

// OAuth2 клиент за автоматично обновяване на access токен
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Създаване на транспортър с актуален access токен
async function createTransporter() {
  try {
    // Получаване на нов access token използвайки refresh token
    const tokens = await oauth2Client.getAccessToken();
    console.log("Successfully refreshed OAuth2 access token");
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: tokens.token || ""
      }
    });
    
    return transporter;
  } catch (error) {
    console.error("Error creating email transporter:", error);
    throw error;
  }
}

// Шаблон за имейла за потвърждение
const createEmailVerificationTemplate = (
  name: string,
  verificationUrl: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://cf.bg/logo.png" alt="65 Roses Logo" style="max-width: 150px;" />
      </div>
      <h1 style="color: #4CAF50;">Hello, ${name}!</h1>
      <p>Thank you for registering in "65 Roses". Please confirm your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirm Email Address</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all;">${verificationUrl}</p>
      <p>If you did not register on our site, you can safely ignore this email.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="color: #666;">Best regards,<br>The "65 Roses" team</p>
      </div>
    </div>
  `;
};

// Mocked имейл услуга за тестване и разработка
const mockSendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  console.log("\n======== MOCK EMAIL ========");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("Body: [HTML content omitted for brevity]");
  console.log("View verification URL in the HTML content");
  console.log("======== END MOCK EMAIL ========\n");
  return true;
};

// Обща функция за изпращане на имейл (реално или mocked)
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  // Използваме mocked имейл за dev/test среда
  if (USE_MOCK_EMAIL) {
    return mockSendEmail(to, subject, html);
  }

  try {
    // Реално изпращане с OAuth2
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"65 Roses" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

// Функция за изпращане на имейл за потвърждение
export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<boolean> => {
  try {
    // Проверяваме дали имаме валиден FRONTEND_URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email/${token}`;
    const subject = "Confirm your email address";
    const html = createEmailVerificationTemplate(name, verificationUrl);
    
    // За тестване в dev среда - показваме токена и URL в конзолата
    if (USE_MOCK_EMAIL) {
      console.log(`\n======== VERIFICATION DETAILS ========`);
      console.log(`Email: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`Verification token: ${token}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log(`======== END VERIFICATION DETAILS ========\n`);
    }
    
    const result = await sendEmail(email, subject, html);
    
    if (!result) {
      console.error(`Failed to send verification email to ${email}`);
    } else {
      console.log(`Successfully sent verification email to ${email}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    return false;
  }
};

// Шаблон за имейла за нулиране на паролата
const createPasswordResetTemplate = (
  name: string,
  resetUrl: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://cf.bg/logo.png" alt="65 Roses Logo" style="max-width: 150px;" />
      </div>
      <h1 style="color: #4CAF50;">Hello, ${name}!</h1>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all;">${resetUrl}</p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="color: #666;">Best regards,<br>The "65 Roses" team</p>
      </div>
    </div>
  `;
};

// Функция за изпращане на имейл за нулиране на паролата
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const subject = "Reset your password";
  const html = createPasswordResetTemplate(name, resetUrl);
  
  // Логваме токена за тестови цели
  if (USE_MOCK_EMAIL) {
    console.log(`Password reset token for testing: ${token}`);
    console.log(`Reset URL: ${resetUrl}`);
  }
  
  return sendEmail(email, subject, html);
};

// Функция за тестване на имейл транспортъра
export const testEmailConnection = async (): Promise<boolean> => {
  if (USE_MOCK_EMAIL) {
    console.log("Using mock email service - connection test always succeeds");
    return true;
  }
  
  try {
    const transporter = await createTransporter();
    return new Promise((resolve) => {
      transporter.verify((error) => {
        if (error) {
          console.error("Email transporter verification failed:", error);
          resolve(false);
        } else {
          console.log("Email server is ready to send messages");
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error("Failed to test email connection:", error);
    return false;
  }
};

export const testOAuth2Connection = async (): Promise<boolean> => {
    try {
      console.log("\n===== TESTING OAUTH2 CONNECTION =====");
      console.log("Attempting to refresh tokens...");
      
      const tokens = await oauth2Client.getAccessToken();
      
      console.log("Successfully obtained access token!");
      console.log(`Token expires in: ${tokens.res?.data.expires_in} seconds`);
      console.log("===== OAUTH2 CONNECTION SUCCESSFUL =====\n");
      
      return true;
    } catch (error) {
      console.error("\n===== OAUTH2 CONNECTION ERROR =====");
      console.error("Failed to obtain access token:", error);
      console.error("===== OAUTH2 CONNECTION FAILED =====\n");
      
      return false;
    }
  };