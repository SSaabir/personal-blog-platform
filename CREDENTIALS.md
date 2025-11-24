# 🔑 Login Credentials

This document contains all default login credentials for the Personal Blog Platform.

## 🛡️ Admin Account

**Admin Portal**: http://localhost:5173/admin/login

```
Email: admin@blogspace.com
Password: Admin@123456
Role: Super Admin
```

**Permissions:**
- View dashboard analytics
- Manage all users (view, restrict, delete)
- Manage all posts (view, restrict, delete)
- Access restricted content
- Full platform control

---

## 👥 User Accounts

**User Portal**: http://localhost:5173/login

All user accounts have the password: `Password123`

### 1. Tech Guru
```
Username: techguru
Email: techguru@example.com
Password: Password123
Bio: Software engineer passionate about clean code and scalable systems
```
**Posts:** 4 posts about TypeScript, microservices, AI replacing developers, and Node.js tutorials

### 2. Foodie Jane
```
Username: foodie_jane
Email: jane.food@example.com
Password: Password123
Bio: Food blogger exploring cuisines from around the world. Vegan recipes are my specialty!
```
**Posts:** 4 posts about veganism ethics, vegan recipes, restaurant reviews, and Mediterranean diet

### 3. Fitness Fanatic
```
Username: fitnessfanatic
Email: fitness@example.com
Password: Password123
Bio: Personal trainer and nutrition coach
```
**Posts:** 4 posts about body positivity criticism, marathon transformation, home workout equipment, and strength training

### 4. Traveler Mike
```
Username: traveler_mike
Email: mike.travels@example.com
Password: Password123
Bio: Digital nomad sharing stories from 50+ countries
```
**Posts:** 4 posts about USA criticism, digital nomad guides, travel photography tips, and budget travel hacks

### 5. Bookworm Sarah
```
Username: bookworm_sarah
Email: sarah.books@example.com
Password: Password123
Bio: Literary critic and avid reader
```
**Posts:** 4 posts about modern literature criticism, book reviews, reading challenges, and reading habits

### 6. Politico Observer
```
Username: politico_observer
Email: observer@example.com
Password: Password123
Bio: Political analyst providing unbiased commentary on current events
```
**Posts:** 4 posts about democracy decline, climate policy, housing crisis, and local elections

---

## 📊 Database Statistics

After running `npm run seed`:

- **Total Admins:** 1 (super-admin)
- **Total Users:** 6
- **Total Posts:** 24
  - Controversial posts: 8
  - Helpful/Balanced posts: 16
- **Total Comments:** 48-120 (2-5 per post)
- **Total Tags:** ~30 unique tags

---

## 🔐 Security Notes

**⚠️ IMPORTANT FOR PRODUCTION:**

1. **Change all passwords** before deploying to production
2. **Update JWT secrets** in `.env`:
   ```env
   JWT_SECRET=use_a_strong_random_secret_here
   ADMIN_JWT_SECRET=use_a_different_strong_secret
   ```
3. **Disable seed script** or remove default credentials
4. **Enable rate limiting** for login attempts
5. **Use HTTPS** in production
6. **Implement password reset** functionality
7. **Add email verification** for new accounts

---

## 🗄️ Database Seeding

To populate the database with these credentials:

```bash
cd backend
npm run seed
```

This will:
- Clear existing data
- **Create 1 admin account** (admin@blogspace.com)
- Create 6 users with hashed passwords
- Create 24 posts across various topics
- Add 2-5 comments to each post
- Assign random saved posts to users

---

## 🧪 Testing Scenarios

### User Flow Testing
1. Register a new account
2. Login with credentials
3. Create a post with tags and cover image
4. Like and comment on other posts
5. Save posts for later
6. Edit your profile and avatar
7. View your posts in "My Posts"
8. Edit or delete your own posts

### Admin Flow Testing
1. Login to admin portal
2. View dashboard analytics
3. Search and filter users
4. Restrict a user with a reason
5. Try logging in as restricted user (should fail)
6. Unrestrict the user
7. Restrict a post with inappropriate content
8. Verify post is hidden from home feed
9. View restricted post as admin
10. Delete users or posts as needed

---

## 🆘 Password Recovery

**Admin Password Recovery:**

If you forget the admin password, re-run the seed script:
```bash
cd backend
npm run seed
```

This will recreate the admin account with the default credentials (admin@blogspace.com / Admin@123456).

**User Password Recovery:**

Currently no recovery mechanism exists (feature to be added).

---

**Last Updated:** November 25, 2025
