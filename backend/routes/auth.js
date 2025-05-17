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

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    // Fetch church member data
    const { data: memberData, error: memberError } = await supabase
      .from('church_members')
      .select('*, roles(name)')
      .eq('id', authData.user.id)
      .single();

    if (memberError) throw memberError;

    res.json({
      user: authData.user,
      session: authData.session,
      churchMember: memberData
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Password reset request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.FRONTEND_URL + '/reset-password'
    });

    if (error) throw error;

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify email
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) throw error;

    res.redirect(process.env.FRONTEND_URL + '/login?verified=true');
  } catch (err) {
    console.error('Email verification error:', err);
    res.redirect(process.env.FRONTEND_URL + '/login?error=verification-failed');
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) throw authError;

    // Fetch church member data with role
    const { data: memberData, error: memberError } = await supabase
      .from('church_members')
      .select('*, roles(name)')
      .eq('id', user.id)
      .single();

    if (memberError) throw memberError;

    res.json({
      user,
      churchMember: memberData
    });

  } catch (err) {
    console.error('Get current user error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;