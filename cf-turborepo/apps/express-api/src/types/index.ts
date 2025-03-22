// Shared types for the Express API
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface IdParam {
  id: string;
} 