export enum UserRole {
  ADMIN = "admin",
  PATIENT = "patient",
  PARENT = "parent",
  DONOR = "donor",
}

export enum UserGroup {
  CAMPAIGNS = "campaigns",
  INITIATIVES = "initiatives",
  CONFERENCES = "conferences",
  EVENTS = "events",
  NEWS = "news",
  BLOG = "blog",
  RECIPES = "recipes",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  groups: string[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
} 