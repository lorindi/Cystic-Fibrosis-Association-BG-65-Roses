import { Request, Response } from 'express';
import { User, IdParam } from '../types/index.js';

// Mock data
let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// GET all users
export const getAllUsers = (_req: Request, res: Response) => {
  res.json(users);
};

// GET user by ID
export const getUserById = (req: Request<IdParam>, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.json(user);
};

// POST new user
export const createUser = (req: Request, res: Response) => {
  const userInput = req.body as Omit<User, 'id' | 'createdAt'>;
  const newUser: User = {
    ...userInput,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
};

// PATCH update user
export const updateUser = (req: Request<IdParam>, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).send('User not found');
  
  const updatedUser = {
    ...users[index],
    ...req.body
  };
  
  users[index] = updatedUser;
  res.json(updatedUser);
};

// DELETE user
export const deleteUser = (req: Request<IdParam>, res: Response) => {
  const initialLength = users.length;
  users = users.filter(u => u.id !== req.params.id);
  
  if (users.length === initialLength) {
    return res.status(404).send('User not found');
  }
  
  res.status(204).end();
}; 