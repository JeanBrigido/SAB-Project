import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

// GET all small groups
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('small_groups')
      .select('*');

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

// GET single small group by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('small_groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Small group not found' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new small group
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      meeting_time,
      location,
      bio,
      meeting_days,
      meeting_time_range
    } = req.body;

    // Validate required fields
    if (!name || !description || !meeting_days || !meeting_time_range || !location) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const { data, error } = await supabase
      .from('small_groups')
      .insert([{ 
        name, 
        description, 
        meeting_time,
        location,
        bio,
        meeting_days,
        meeting_time_range
      }])
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

// PUT update small group
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      meeting_time,
      location,
      bio,
      meeting_days,
      meeting_time_range
    } = req.body;

    const { data, error } = await supabase
      .from('small_groups')
      .update({ 
        name, 
        description, 
        meeting_time,
        location,
        bio,
        meeting_days,
        meeting_time_range
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ error: 'Small group not found' });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE small group
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('small_groups')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Small group not found' });
    }

    res.json({ message: 'Small group deleted successfully', data });
  } catch (err) {
    console.error('Delete route error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

