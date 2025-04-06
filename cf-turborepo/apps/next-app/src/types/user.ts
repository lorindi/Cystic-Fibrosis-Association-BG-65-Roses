export enum UserRole {
  ADMIN = "admin",
  PATIENT = "patient",
  PARENT = "parent",
  DONOR = "donor",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
} 