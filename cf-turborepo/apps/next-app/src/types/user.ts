export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  groups: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  deactivatedAt?: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    avatar?: string;
    bio?: string;
    birthDate?: string;
    diagnosed?: boolean;
    diagnosisYear?: number;
    childName?: string;
    companyName?: string;
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
  };
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