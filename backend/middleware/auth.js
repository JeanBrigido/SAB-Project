import jwt from 'jsonwebtoken';
import supabase from '../supabase.js';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if user has required role
export const hasRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Query church_members to get role_id
      const { data: member } = await supabase
        .from('church_members')
        .select('role_id')
        .eq('id', req.user.id)
        .single();

      if (!member) {
        return res.status(403).json({ error: 'Member not found' });
      }

      // Query roles table with the role_id
      const { data: userRole } = await supabase
        .from('roles')
        .select('name')
        .eq('id', member.role_id)
        .single();

      if (!userRole) {
        return res.status(403).json({ error: 'Role not found' });
      }

      if (allowedRoles.includes(userRole.name)) {
        next();
      } else {
        res.status(403).json({ error: 'Insufficient permissions' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};

// Check if user is small group leader
export const isSmallGroupLeader = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // Check small_group_members table for leader status
    const { data: groupMember } = await supabase
      .from('small_group_members')
      .select('is_leader')
      .eq('group_id', groupId)
      .eq('church_member_id', userId)
      .single();

    // Also check if user has admin/dev role
    const { data: member } = await supabase
      .from('church_members')
      .select('role_id')
      .eq('id', userId)
      .single();

    const { data: role } = await supabase
      .from('roles')
      .select('name')
      .eq('id', member.role_id)
      .single();

    if (groupMember?.is_leader || role?.name === 'dev' || role?.name === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Not authorized to modify this group' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};