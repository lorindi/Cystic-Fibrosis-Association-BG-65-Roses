import express from 'express';

const router = express.Router();

// Mock data
let users = [
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
router.get('/', (req, res) => {
  res.json(users);
});

// GET user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

// POST new user
router.post('/', (req, res) => {
  const userInput = req.body;
  const newUser = {
    ...userInput,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PATCH update user
router.patch('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).send('User not found');
  
  const updatedUser = {
    ...users[index],
    ...req.body
  };
  
  users[index] = updatedUser;
  res.json(updatedUser);
});

// DELETE user
router.delete('/:id', (req, res) => {
  const initialLength = users.length;
  users = users.filter(u => u.id !== req.params.id);
  
  if (users.length === initialLength) {
    return res.status(404).send('User not found');
  }
  
  res.status(204).end();
});

export default router; 