import jwt from 'jsonwebtoken';
import supabase from '../supabase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Headers:', req.headers);
    console.log('Authorization:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Validate Asgardeo UUID token format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidPattern.test(token)) {
      console.error('Token validation failed:', {
        token: token.substring(0, 10) + '...',
        matches_pattern: false
      });
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Token is valid, attach it to request object
    req.token = token;
    console.log('Token validated successfully');
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ 
      error: 'Authentication error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (roleNames) => {
  return async (req, res, next) => {
    try {
      const { data: memberData, error } = await supabase
        .from('church_members')
        .select('*, roles(name)')
        .eq('id', req.user.id)
        .single();

      if (error) throw error;

      if (!roleNames.includes(memberData.roles.name)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (err) {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
};