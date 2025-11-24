import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No admin token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if this is an admin token
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const admin = await Admin.findById(decoded.adminId).select('-password');

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found.' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is deactivated.' });
    }

    req.admin = {
      adminId: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'Invalid admin token.' });
  }
};

// Middleware to check specific permissions
export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Admin authentication required.' });
    }

    // Super admin has all permissions
    if (req.admin.role === 'super-admin') {
      return next();
    }

    // Check specific permission
    if (!req.admin.permissions[permission]) {
      return res.status(403).json({ 
        message: `Access denied. Required permission: ${permission}` 
      });
    }

    next();
  };
};
