import jwt from 'jsonwebtoken';

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