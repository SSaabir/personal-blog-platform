# 🔌 API Documentation

Complete API reference for the Personal Blog Platform.

**Base URL:** `http://localhost:5000/api`

---

## 📑 Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
  - [User Authentication](#user-authentication)
  - [Admin Authentication](#admin-authentication)
- [Post Endpoints](#post-endpoints)
- [Admin Endpoints](#admin-endpoints)

---

## Authentication Endpoints

### User Authentication

#### Register User

Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "",
    "bio": ""
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Email already exists

---

#### Login User

Authenticate and receive JWT token.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "/uploads/avatar-123456.jpg",
    "bio": "Software developer"
  }
}
```

**Restricted User Response (403 Forbidden):**
```json
{
  "message": "User is restricted",
  "reason": "Violated community guidelines"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid credentials
- `403 Forbidden` - User is restricted
- `404 Not Found` - User doesn't exist

---

#### Get Current User

Retrieve authenticated user's information.

```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "avatar": "/uploads/avatar-123456.jpg",
  "bio": "Software developer",
  "savedPosts": ["507f191e810c19729de860ea", "..."],
  "isRestricted": false,
  "restrictedReason": "",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

#### Update Profile

Update user profile (bio and avatar).

```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  bio: "Updated bio text"
  avatar: File (image file)
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "/uploads/avatar-1732456789-987654321.jpg",
    "bio": "Updated bio text"
  }
}
```

**Validation:**
- Bio: Max 500 characters
- Avatar: Images only (jpg, png, gif), max 5MB

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `400 Bad Request` - Validation error

---

#### Save/Unsave Post

Toggle saved status for a post.

```http
POST /api/auth/save/:postId
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Post saved",
  "saved": true,
  "savedPosts": ["507f191e810c19729de860ea", "..."]
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Post not found

---

#### Get Saved Posts

Retrieve all posts saved by the user.

```http
GET /api/auth/saved-posts
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "title": "Post Title",
    "content": "Post content...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "author",
      "avatar": "/uploads/avatar.jpg"
    },
    "coverImage": "/uploads/cover.jpg",
    "tags": ["javascript", "tutorial"],
    "likes": ["user1", "user2"],
    "comments": [...],
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

---

#### Get User Activity

Get user's posts, comments, likes, and saved posts.

```http
GET /api/auth/activity
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "posts": 15,
  "comments": 42,
  "likes": 128,
  "savedPosts": 8
}
```

---

### Admin Authentication

#### Admin Login

Authenticate as admin and receive admin token.

```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@blogspace.com",
  "password": "Admin@123456"
}
```

**Response (200 OK):**
```json
{
  "adminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Super Admin",
    "email": "admin@blogspace.com",
    "role": "super_admin"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid credentials
- `404 Not Found` - Admin not found

---

#### Get Current Admin

Retrieve authenticated admin's information.

```http
GET /api/admin/me
Authorization: Bearer {adminToken}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Super Admin",
  "email": "admin@blogspace.com",
  "role": "super_admin",
  "permissions": ["manage_users", "manage_posts", "view_analytics"]
}
```

---

## Post Endpoints

#### Get All Posts

Retrieve posts with pagination, search, and filtering.

```http
GET /api/posts?page=1&limit=10&search=keyword&tag=javascript
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Posts per page (default: 10, max: 100)
- `search` (optional) - Search keyword (full-text search)
- `tag` (optional) - Filter by tag

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f191e810c19729de860ea",
      "title": "Getting Started with React",
      "content": "React is a JavaScript library...",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "avatar": "/uploads/avatar.jpg"
      },
      "coverImage": "/uploads/cover-123.jpg",
      "tags": ["react", "javascript", "tutorial"],
      "likes": ["user1", "user2"],
      "comments": [
        {
          "_id": "comment1",
          "user": {
            "_id": "user1",
            "username": "commenter",
            "avatar": "/uploads/avatar2.jpg"
          },
          "text": "Great post!",
          "createdAt": "2025-01-15T11:00:00.000Z"
        }
      ],
      "isRestricted": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalPosts": 48
}
```

**Note:** Only returns non-restricted posts for regular users.

---

#### Get Single Post

Retrieve a specific post by ID.

```http
GET /api/posts/:id
```

**Response (200 OK):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "Post Title",
  "content": "Full post content...",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "avatar": "/uploads/avatar.jpg",
    "bio": "Software developer"
  },
  "coverImage": "/uploads/cover.jpg",
  "tags": ["javascript", "tutorial"],
  "likes": ["user1", "user2"],
  "comments": [...],
  "isRestricted": false,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Restricted Post Response:**
```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "Restricted Post",
  "content": "Content...",
  "isRestricted": true,
  "restrictionInfo": {
    "isRestricted": true,
    "reason": "This post has been restricted by administrators"
  }
}
```

**Error Responses:**
- `404 Not Found` - Post doesn't exist

---

#### Get User's Posts

Retrieve all posts by a specific user.

```http
GET /api/posts/user/:userId
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "title": "User's Post",
    "content": "Content...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "avatar": "/uploads/avatar.jpg"
    },
    "coverImage": "/uploads/cover.jpg",
    "tags": ["tag1"],
    "likes": [],
    "comments": [],
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

---

#### Create Post

Create a new blog post.

```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  title: "Post Title"
  content: "Post content here..."
  coverImage: File (optional)
  tags[]: "javascript"
  tags[]: "tutorial"
```

**Validation:**
- Title: 3-200 characters
- Content: Minimum 10 characters
- Cover Image: Images only, max 5MB
- Tags: Array of strings

**Response (201 Created):**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "507f191e810c19729de860ea",
    "title": "Post Title",
    "content": "Post content here...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "avatar": "/uploads/avatar.jpg"
    },
    "coverImage": "/uploads/cover-1732456789.jpg",
    "tags": ["javascript", "tutorial"],
    "likes": [],
    "comments": [],
    "isRestricted": false,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Not logged in
- `400 Bad Request` - Validation error

---

#### Update Post

Update an existing post (author only).

```http
PUT /api/posts/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  title: "Updated Title"
  content: "Updated content..."
  coverImage: File (optional)
  tags[]: "updated-tag"
```

**Response (200 OK):**
```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": "507f191e810c19729de860ea",
    "title": "Updated Title",
    "content": "Updated content...",
    "coverImage": "/uploads/cover-new.jpg",
    "tags": ["updated-tag"],
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Not the post author
- `404 Not Found` - Post doesn't exist

---

#### Delete Post

Delete a post (author only).

```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Not the post author
- `404 Not Found` - Post doesn't exist

---

#### Like/Unlike Post

Toggle like status on a post.

```http
POST /api/posts/:id/like
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Post liked",
  "likes": ["user1", "user2", "currentUser"],
  "isLiked": true
}
```

**Or when unliking:**
```json
{
  "message": "Post unliked",
  "likes": ["user1", "user2"],
  "isLiked": false
}
```

---

#### Add Comment

Add a comment to a post.

```http
POST /api/posts/:id/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Great post! Very helpful."
}
```

**Response (201 Created):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "Post Title",
  "comments": [
    {
      "_id": "comment123",
      "user": {
        "_id": "currentUserId",
        "username": "johndoe",
        "avatar": "/uploads/avatar.jpg"
      },
      "text": "Great post! Very helpful.",
      "createdAt": "2025-01-15T12:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Not logged in
- `404 Not Found` - Post doesn't exist
- `400 Bad Request` - Empty comment

---

#### Delete Comment

Delete your own comment.

```http
DELETE /api/posts/:id/comments/:commentId
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Comment deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Not the comment author
- `404 Not Found` - Post or comment doesn't exist

---

## Admin Endpoints

#### Dashboard Analytics

Get platform statistics for admin dashboard.

```http
GET /api/admin/dashboard
Authorization: Bearer {adminToken}
```

**Response (200 OK):**
```json
{
  "totalUsers": 156,
  "totalPosts": 487,
  "totalComments": 1243,
  "activeUsers": 42,
  "recentUsers": [
    {
      "_id": "user1",
      "username": "newuser",
      "email": "new@example.com",
      "avatar": "",
      "createdAt": "2025-01-20T10:00:00.000Z"
    }
  ],
  "recentPosts": [
    {
      "_id": "post1",
      "title": "Recent Post",
      "author": {
        "username": "author",
        "avatar": "/uploads/avatar.jpg"
      },
      "tags": ["tag1", "tag2"],
      "createdAt": "2025-01-20T11:00:00.000Z"
    }
  ]
}
```

**Note:** 
- Active users = users who posted in last 30 days
- Recent users = last 5 registered users
- Recent posts = last 5 created posts

---

#### Get All Users (Admin)

Retrieve all users with search and pagination.

```http
GET /api/admin/users?page=1&limit=10&search=keyword
Authorization: Bearer {adminToken}
```

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Users per page (default: 10)
- `search` (optional) - Search by username or email

**Response (200 OK):**
```json
{
  "users": [
    {
      "_id": "user1",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "/uploads/avatar.jpg",
      "bio": "Developer",
      "isRestricted": false,
      "restrictedReason": "",
      "postCount": 12,
      "createdAt": "2025-01-10T10:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 16,
  "totalUsers": 156
}
```

---

#### Get All Posts (Admin)

Retrieve all posts including restricted ones.

```http
GET /api/admin/posts?page=1&limit=10&search=keyword
Authorization: Bearer {adminToken}
```

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "post1",
      "title": "Post Title",
      "author": {
        "username": "author",
        "avatar": "/uploads/avatar.jpg"
      },
      "tags": ["tag1"],
      "isRestricted": true,
      "restrictedReason": "Inappropriate content",
      "comments": [...],
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 49,
  "totalPosts": 487
}
```

---

#### Restrict/Unrestrict User

Toggle user restriction status.

```http
PUT /api/admin/users/:id/restrict
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "isRestricted": true,
  "restrictedReason": "Violated community guidelines"
}
```

**Response (200 OK):**
```json
{
  "message": "User restriction updated successfully",
  "user": {
    "_id": "user1",
    "username": "johndoe",
    "isRestricted": true,
    "restrictedReason": "Violated community guidelines"
  }
}
```

**To unrestrict:**
```json
{
  "isRestricted": false,
  "restrictedReason": ""
}
```

**Effect:** Restricted users cannot log in.

---

#### Restrict/Unrestrict Post

Toggle post restriction status.

```http
PUT /api/admin/posts/:id/restrict
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "isRestricted": true,
  "restrictedReason": "Contains inappropriate content"
}
```

**Response (200 OK):**
```json
{
  "message": "Post restriction updated successfully",
  "post": {
    "_id": "post1",
    "title": "Post Title",
    "isRestricted": true,
    "restrictedReason": "Contains inappropriate content"
  }
}
```

**Effect:** Restricted posts are hidden from homepage but visible on post detail page with warning.

---

#### Delete User (Admin)

Permanently delete a user account.

```http
DELETE /api/admin/users/:id
Authorization: Bearer {adminToken}
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Note:** This is permanent and cannot be undone.

---

#### Delete Post (Admin)

Delete any post regardless of author.

```http
DELETE /api/admin/posts/:id
Authorization: Bearer {adminToken}
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

**Last Updated:** November 24, 2025
