export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  groups?: UserGroup[];
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  profile?: UserProfile;
}

export enum UserRole {
  PATIENT = 'patient',
  PARENT = 'parent',
  DONOR = 'donor',
  ADMIN = 'admin'
}

export enum UserGroup {
  CAMPAIGNS = 'campaigns',
  INITIATIVES = 'initiatives',
  CONFERENCES = 'conferences',
  EVENTS = 'events',
  NEWS = 'news',
  BLOG = 'blog',
  RECIPES = 'recipes'
}

export interface UserProfile {
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

export interface ProfileUpdateInput {
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
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user: User | null;
  token?: string;
} 