// backend/server.js
import dotenv from 'dotenv';
dotenv.config(); // 👈 Load environment variables first

import express from 'express';
import cors from 'cors';

import supabase from './supabase.js';  // Note the .js extension!

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Supabase connection on server start
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected. Sample data:', data);
    }
  } catch (err) {
    console.error('❌ Unexpected error testing Supabase:', err.message);
  }
});

// Routes
app.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/events', async (req, res) => {
  try {
    const { event_name, description, event_date } = req.body;
    const { data, error } = await supabase
      .from('events')
      .insert([{ event_name, description, event_date }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
