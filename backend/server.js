import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'; // Fix the import
import eventRoutes from './routes/events.js';
import smallGroupRoutes from './routes/small_groups.js';
import contactRoutes from './routes/contact_us.js';
import authRoutes from './routes/auth.js';
import verseRoutes from './routes/verse.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
  origin: [
    'https://sab-project-8pv7.vercel.app', // Your Vercel frontend
    'http://localhost:5173' // Keep local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/small-groups', smallGroupRoutes);
app.use('/contact-us', contactRoutes);
app.use('/api', verseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Server startup
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
