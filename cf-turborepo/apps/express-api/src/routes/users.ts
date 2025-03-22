import express, { RequestHandler } from 'express';
import { IdParam } from '../types/index.js';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/user-controller.js';

const router = express.Router();

// GET all users
router.get('/', getAllUsers as RequestHandler);

// GET user by ID
router.get('/:id', getUserById as RequestHandler<IdParam>);

// POST new user
router.post('/', createUser as RequestHandler);

// PATCH update user
router.patch('/:id', updateUser as RequestHandler<IdParam>);

// DELETE user
router.delete('/:id', deleteUser as RequestHandler<IdParam>);

export default router; 