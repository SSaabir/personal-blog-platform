import express from 'express';
import { body } from 'express-validator';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getAllPosts,
  getUserPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment
} from '../controllers/postController.js';

const router = express.Router();

// Get all posts (with pagination and search)
router.get('/', optionalAuth, getAllPosts);

// Get user's posts
router.get('/user/:userId', getUserPosts);

// Get single post
router.get('/:id', optionalAuth, getPostById);

// Create post
router.post('/', authMiddleware, upload.single('image'), createPost);

// Update post
router.put('/:id', authMiddleware, upload.single('image'), updatePost);

// Delete post
router.delete('/:id', authMiddleware, deletePost);

// Like/Unlike post
router.post('/:id/like', authMiddleware, toggleLike);

// Add comment
router.post('/:id/comments', authMiddleware,
  [
    body('text').trim().notEmpty().withMessage('Comment text is required')
  ],
  addComment
);

// Delete comment
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);

export default router;
