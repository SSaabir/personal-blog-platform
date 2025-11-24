# 📝 Personal Blog Platform

A modern, full-stack blog platform with admin panel featuring user management, post moderation, and content restriction capabilities. Built with React, Node.js, Express, and MongoDB.

![React](https://img.shields.io/badge/React-18.3.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8)

## ✨ Features

### User Features
- 🔐 **Secure Authentication** - JWT-based login/registration with bcrypt password hashing
- 👤 **User Profiles** - Custom avatars (file upload), bio, and activity tracking
- ✍️ **Blog Management** - Create, edit, delete posts with rich content
- 🖼️ **Image Uploads** - Cover images and avatar uploads via Multer
- 🏷️ **Tag System** - Categorize posts with multiple tags
- ❤️ **Engagement** - Like/unlike posts, add/delete comments
- 🔍 **Search & Filter** - Full-text search and tag-based filtering
- 💾 **Save Posts** - Bookmark posts for later reading
- 📊 **Activity Dashboard** - View your posts, likes, and saved content

### Admin Features
- 🛡️ **Separate Admin Portal** - Independent authentication system
- 📈 **Analytics Dashboard** - Real-time stats (users, posts, comments, activity)
- 👥 **User Management** - View, search, restrict/unrestrict users
- 📝 **Post Moderation** - Review, restrict/unrestrict controversial posts
- 🚫 **Content Restriction** - Block users from login or hide posts with reasons
- 🔎 **Advanced Search** - Filter and manage all platform content

### Design
- 🎨 **Modern UI** - Navy/sage/cream color palette with Tailwind CSS v4
- 📱 **Fully Responsive** - Mobile-first design approach
- ⚡ **Fast & Smooth** - Optimized performance with Vite

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - Component-based UI
- **Vite** 7.2.4 - Lightning-fast build tool
- **Tailwind CSS** 4.1.17 - Utility-first CSS with custom theme
- **React Router DOM** 7.1.1 - Client-side routing
- **Axios** - HTTP requests
- **date-fns** - Date formatting
- **lucide-react** - Icon library

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **express-validator** - Input validation

## 📋 Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB Atlas Account** (Free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/SSaabir/personal-blog-platform.git
cd personal-blog-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_in_production
ADMIN_JWT_SECRET=your_admin_secret_key_change_in_production
NODE_ENV=development
```

**MongoDB Atlas Setup:**
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0)
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Replace `<password>` in the connection string with your database user password
7. Paste the complete connection string into `MONGODB_URI` in `.env`

**Frontend** - Already configured (uses `http://localhost:5000`)

### 3. Seed Database (Required for First Setup)

Populate with admin account, 6 users, and 24 posts:

```bash
cd backend
npm run seed
```

**This will create:**
- 1 Admin account (admin@blogspace.com)
- 6 Test users (all password: Password123)
- 24 Blog posts with comments

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173 (or 5174/5175 if port busy)
```

### 5. Access the Platform

- **User Portal**: http://localhost:5173
- **Admin Portal**: http://localhost:5173/admin/login
- **API**: http://localhost:5000/api

## 📚 Documentation

- **[CREDENTIALS.md](CREDENTIALS.md)** - Login credentials for admin and test users
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with all endpoints
- **[FRONTEND_DOCUMENTATION.md](FRONTEND_DOCUMENTATION.md)** - Frontend architecture, pages, components, and data flow



## 🐛 Troubleshooting

**MongoDB Connection Failed**
- Check your MongoDB Atlas connection string in `.env`
- Verify your IP address is whitelisted in Atlas Network Access
- Ensure database user credentials are correct
- Check if connection string includes correct database name

**Port Already in Use**
- Frontend: Vite auto-increments (5173 → 5174 → 5175)
- Backend: Change `PORT` in `.env`

**Token Expired/Invalid**
- Clear localStorage and re-login
- Check JWT_SECRET matches between requests

**File Upload Errors**
- Ensure `backend/uploads/` directory exists
- Check file size (5MB limit)
- Verify file type (images only)

**Admin Can't Login**
- Run seed script to create admin: `npm run seed`
- Or manually create via `createSuperAdmin.js`

**Posts Not Showing**
- Check if posts are restricted (admin can see all)
- Verify MongoDB has data: `npm run seed`
- Check browser console for API errors

## 🚀 Deployment

### Backend (Railway/Render)
1. Push to GitHub
2. Connect repository to platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variables
4. Configure redirects for SPA

## 📄 License

MIT License - feel free to use for learning and projects.

## 👤 Author

**SSaabir**
- GitHub: [@SSaabir](https://github.com/SSaabir)

---

**Built with ❤️ using React, Node.js, and MongoDB**
