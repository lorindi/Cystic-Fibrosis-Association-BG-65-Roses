export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'parent' | 'donor' | 'admin';
  groups?: string[];
  isEmailVerified: boolean;
  profile?: {
    avatar?: string;
    bio?: string;
    birthDate?: string;
    address?: {
      city: string;
      postalCode?: string;
      street?: string;
    };
    contact?: {
      phone?: string;
      alternativeEmail?: string;
      emergencyContact?: {
        name: string;
        phone: string;
        relation: string;
      };
    };
    diagnosed?: boolean;
    diagnosisYear?: number;
    childName?: string;
    companyName?: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user: User | null;
  token?: string;
} 