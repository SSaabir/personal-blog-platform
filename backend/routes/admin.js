import express from 'express';
import { body } from 'express-validator';
import { adminAuthMiddleware, checkPermission } from '../middleware/adminAuth.js';
import {
  adminLogin,
  getCurrentAdmin,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  getUserById,
  deleteUser,
  toggleUserRestriction,
  getAdminPosts,
  togglePostRestriction,
  deleteAdminPost,
  deleteAdminComment,
  getDashboardAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

// ===== ADMIN AUTHENTICATION =====

// Admin Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  adminLogin
);

// Get current admin info
router.get('/me', adminAuthMiddleware, getCurrentAdmin);

// ===== ADMIN MANAGEMENT =====

// Create new admin (super-admin only)
router.post('/create', 
  adminAuthMiddleware,
  checkPermission('canManageAdmins'),
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'moderator']).withMessage('Invalid role')
  ],
  createAdmin
);

// Get all admins (super-admin only)
router.get('/all', 
  adminAuthMiddleware,
  checkPermission('canManageAdmins'),
  getAllAdmins
);

// Update admin (super-admin only)
router.put('/:id',
  adminAuthMiddleware,
  checkPermission('canManageAdmins'),
  updateAdmin
);

// Delete admin (super-admin only)
router.delete('/:id',
  adminAuthMiddleware,
  checkPermission('canManageAdmins'),
  deleteAdmin
);

// ===== USER MANAGEMENT =====

// Get all users
router.get('/users',
  adminAuthMiddleware,
  checkPermission('canManageUsers'),
  getAllUsers
);

// Get single user details
router.get('/users/:id',
  adminAuthMiddleware,
  checkPermission('canManageUsers'),
  getUserById
);

// Toggle user restriction
router.put('/users/:id/restrict',
  adminAuthMiddleware,
  checkPermission('canManageUsers'),
  toggleUserRestriction
);

// Delete user
router.delete('/users/:id',
  adminAuthMiddleware,
  checkPermission('canManageUsers'),
  deleteUser
);

// ===== POST MANAGEMENT =====

// Get all posts with filters
router.get('/posts',
  adminAuthMiddleware,
  checkPermission('canManagePosts'),
  getAdminPosts
);

// Toggle post restriction
router.put('/posts/:id/restrict',
  adminAuthMiddleware,
  checkPermission('canManagePosts'),
  togglePostRestriction
);

// Delete any post
router.delete('/posts/:id',
  adminAuthMiddleware,
  checkPermission('canManagePosts'),
  deleteAdminPost
);

// Delete comment from any post
router.delete('/posts/:postId/comments/:commentId',
  adminAuthMiddleware,
  checkPermission('canManagePosts'),
  deleteAdminComment
);

// ===== ANALYTICS =====

// Get dashboard statistics
router.get('/analytics/dashboard',
  adminAuthMiddleware,
  checkPermission('canViewAnalytics'),
  getDashboardAnalytics
);

export default router;
