import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

// POST new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const { data, error } = await supabase
      .from('contact_us')
      .insert([
        { 
          name, 
          email, 
          phone, 
          message,
          submitted_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;