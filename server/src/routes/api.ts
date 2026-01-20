import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/hello
router.get('/hello', (_req: Request, res: Response) => {
  res.json({
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/users (example endpoint)
router.get('/users', (_req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];
  res.json(users);
});

// POST /api/users (example endpoint)
router.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
  };
  
  res.status(201).json(newUser);
});

export default router;
