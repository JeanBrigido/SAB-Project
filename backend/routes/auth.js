import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth
      .signUp({
        email,
        password,
      });

    if (authError) throw authError;

    // Create church member record
    const { error: memberError } = await supabase
      .from('church_members')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          phone,
          role_id: 6, // Default to 'member' role
          joined_date: new Date().toISOString()
        }
      ]);

    if (memberError) throw memberError;

    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.' 
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;