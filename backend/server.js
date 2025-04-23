// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventRoutes);

// Server startup
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
