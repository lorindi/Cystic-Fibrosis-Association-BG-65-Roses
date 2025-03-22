// Simple Express server with TypeScript
import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import { User, IdParam } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Mock data
const users: User[] = [
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

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/express/users', usersRouter);

// Legacy API routes directly in server.js
app.get('/api/express/users-legacy', ((_req: Request, res: Response) => {
  res.json(users);
}) as RequestHandler);

app.get('/api/express/users-legacy/:id', ((req: Request<IdParam>, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.json(user);
}) as RequestHandler<IdParam>);

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
}); 