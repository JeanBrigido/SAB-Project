import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events.js';
import smallGroupRoutes from './routes/small_groups.js';
import contactRoutes from './routes/contact_us.js';
import authRoutes from './routes/auth.js';
import verseRoutes from './routes/verse.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration with Azure best practices
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://sab-project-8pv7.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });
  next();
});


// Environment check
console.log('✅ Environment:', process.env.NODE_ENV);
console.log('✅ Azure OpenAI Endpoint configured:', !!process.env.AZURE_AI_ENDPOINT);

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/small-groups', smallGroupRoutes);
app.use('/contact-us', contactRoutes);
app.use('/api/verse', verseRoutes);  // Changed to explicit path

// Error handling middleware - must be after routes
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - must be after routes and error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Server startup with error handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
