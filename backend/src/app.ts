import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authroutes';
import propertyRoutes from './routes/propertyroutes';
import favoriteRoutes from './routes/favoriteroutes';
import recommendationRoutes from './routes/recommendationroutes';
import { Request, Response } from 'express';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (_: Request, res: Response) => res.send('API is running...'));

export default app;
