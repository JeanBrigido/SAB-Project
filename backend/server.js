// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import supabase from './supabase.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    res.json(data);
  } catch (err) {
    console.error('Route error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/events', async (req, res) => {
  try {
    const { event_name, event_date, location, description, event_time } = req.body;
    
    // Add validation
    if (!event_name || !event_date || !location || !description || !event_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('events')
      .insert([{ event_name, event_date, location, description, event_time }])
      .select(); // Add .select() to return the inserted data

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Route error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { event_name, event_date, location, description, event_time } = req.body;

    const { data, error } = await supabase
      .from('events')
      .update({ event_name, event_date, location, description, event_time })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Move app.listen to the end
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  try {
    const { data, error } = await supabase.from('events').select('*').limit(1);
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (err) {
    console.error('❌ Unexpected error testing Supabase:', err.message);
  }
});
