import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/user';
// import loginRoutes from './routes/login';
import bodyParser from 'body-parser';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoutes)
// app.use('/api'loginRoutes)
// Example: Get all recipes
app.get('/recipes', async (req, res) => {
  const recipes = await prisma.recipe.findMany({
    include: {
      user: true,
      comments: true,
      favorites: true,
    },
  });
  res.json(recipes);
});

// Example: Create a new recipe
app.post('/recipes', async (req, res) => {
  const { title, description, ingredients, steps, userId } = req.body;
  const newRecipe = await prisma.recipe.create({
    data: {
      title,
      description,
      ingredients,
      steps,
      user: { connect: { id: userId } },
    },
  });
  res.status(201).json(newRecipe);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
