import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db';
import authRoutes from './routes/authroutes';
import propertyRoutes from './routes/propertyroutes';
import favoriteRoutes from './routes/favoriteroutes';
import recommendationRoutes from './routes/recommendationroutes';
import { Request, Response } from 'express';

dotenv.config();
connectDB();

const app = express();

// CORS configuration for production
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'https://property-listing-bice-nine.vercel.app', // Replace with your actual Vercel domain
    process.env.FRONTEND_URL || ''
  ].filter(Boolean), // Remove empty strings
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware for debugging
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Query params:', req.query);
  if (req.method !== 'GET') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/favorites', favoriteRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Property Management API is running...',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      properties: '/api/properties',
      recommendations: '/api/recommendations',
      favorites: '/api/favorites'
    }
  });
});

// 404 handler for debugging
app.use('*', (req: Request, res: Response) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/health',
      '/api/auth',
      '/api/properties',
      '/api/recommendations',
      '/api/favorites'
    ]
  });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default app;