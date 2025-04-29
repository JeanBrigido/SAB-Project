import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import supabase from '../supabase.js';

const router = express.Router();

// Public routes - no auth needed
router.get('/', async (req, res) => {
  try {
    console.log('GET /events - Fetching all events');
    const { data, error } = await supabase.from('events').select('*');
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} events`);
    return res.json(data);
  } catch (err) {
    console.error('Route error:', err);
    return res.status(500).json({ 
      error: 'Failed to fetch events',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Protected routes - need authentication
router.post('/', verifyToken, async (req, res) => {
  try {
    const { event_name, event_date, location, description, event_time } = req.body;
    
    // Validate required fields
    if (!event_name || !event_date || !location || !description || !event_time) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['event_name', 'event_date', 'location', 'description', 'event_time']
      });
    }

    // Insert event into Supabase
    const { data, error } = await supabase
      .from('events')
      .insert([{ 
        event_name, 
        event_date, 
        location, 
        description, 
        event_time
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Event created:', data);
    res.status(201).json(data);
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { event_name, event_date, location, description, event_time } = req.body;

    // Validate required fields
    if (!event_name || !event_date || !location || !description || !event_time) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['event_name', 'event_date', 'location', 'description', 'event_time']
      });
    }

    // Add logging to debug the update
    console.log('Updating event:', {
      id,
      event_name,
      event_date,
      location,
      description,
      event_time
    });

    const { data, error } = await supabase
      .from('events')
      .update({ 
        event_name, 
        event_date, 
        location, 
        description, 
        event_time 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json(data);
  } catch (err) {
    console.error('Route error:', err);
    return res.status(500).json({ 
      error: 'Failed to update event',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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
