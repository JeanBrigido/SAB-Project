import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events.js';
import smallGroupRoutes from './routes/small_groups.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import verseRoutes from './routes/verse.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/small-groups', smallGroupRoutes);
app.use('/contact-us', contactRoutes);
app.use('/api', verseRoutes);

// Server startup
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
