import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import supabase from '../supabase.js';

const router = express.Router();

// Public routes - no auth needed
router.get('/', async (req, res) => {
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

// Protected routes - need authentication
router.post('/', verifyToken, async (req, res) => {
  try {
    const { event_name, event_date, location, description, event_time } = req.body;
    
    if (!event_name || !event_date || !location || !description || !event_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('events')
      .insert([{ event_name, event_date, location, description, event_time }])
      .select();

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

router.put('/:id', verifyToken, async (req, res) => {
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

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete event with ID:', id);

    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully', data });
  } catch (err) {
    console.error('Delete route error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
