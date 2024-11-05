import express, {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();
// Create User Endpoint
router.post('/users', async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;
  
  const salt = await bcrypt.genSalt(10); // You can adjust the salt rounds
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User creation failed." });
  }
});

// Example: Get all users (for testing purposes)
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;