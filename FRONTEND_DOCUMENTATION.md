# 🎨 Frontend Documentation

Complete frontend architecture and component documentation for the Personal Blog Platform.

---

## 📑 Table of Contents

- [Pages Overview](#pages-overview)
- [Components](#components)
- [Context & State Management](#context--state-management)
- [Data Flow](#data-flow)
- [Styling System](#styling-system)
- [Routing](#routing)

---

## Pages Overview

### Public Pages

#### Home (`/`)

**Purpose:** Main landing page displaying all blog posts

**Features:**
- Hero section with platform description
- Search bar (full-text search)
- Tag filter dropdown (dynamically populated from posts)
- Grid layout of post cards (3 columns on desktop)
- Fetches up to 100 posts by default
- Loading state with spinner
- Empty state when no posts found

**State:**
```javascript
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [selectedTag, setSelectedTag] = useState('');
```

**API Calls:**
- `GET /api/posts?limit=100&search={searchTerm}&tags={selectedTag}`

**Dependencies:**
- Re-fetches when `searchTerm` or `selectedTag` changes

---

#### Post Detail (`/post/:id`)

**Purpose:** Display full post content with interactions

**Features:**
- Full post content with formatting
- Cover image header (if exists)
- Author information with avatar
- Like button (requires authentication)
- Comment section (read by all, write with auth)
- Delete own comments
- Restriction warning banner (if post is restricted)
- Related posts by same author
- Tag pills

**State:**
```javascript
const [post, setPost] = useState(null);
const [loading, setLoading] = useState(true);
const [newComment, setNewComment] = useState('');
const [isLiked, setIsLiked] = useState(false);
```

**API Calls:**
- `GET /api/posts/:id` - Fetch post
- `POST /api/posts/:id/like` - Toggle like
- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment

**Restriction Handling:**
```javascript
if (post.isRestricted) {
  // Show red warning banner
  // Display restrictedReason
}
```

---

#### Login (`/login`)

**Purpose:** User authentication

**Features:**
- Email and password inputs
- Client-side validation
- Redirects to home on success
- Shows restriction message if user is restricted
- Link to registration page

**State:**
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

**Flow:**
1. User enters credentials
2. Form validation
3. API call to `/api/auth/login`
4. If successful: store token, update context, redirect to home
5. If restricted: show special error message with reason
6. If failed: show error message

---

#### Register (`/register`)

**Purpose:** Create new user account

**Features:**
- Username, email, password inputs
- Password confirmation
- Client-side validation (email format, password length)
- Auto-login on success
- Link to login page

**Validation Rules:**
- Username: Min 3 characters
- Email: Valid email format
- Password: Min 6 characters
- Passwords must match

**Flow:**
1. User fills form
2. Client validates
3. API call to `/api/auth/register`
4. Auto-login with returned token
5. Redirect to home

---

### Protected Pages (Require Authentication)

#### Create Post (`/create`)

**Purpose:** Create new blog posts

**Features:**
- Title input (3-200 chars)
- Content textarea (min 10 chars)
- Cover image upload with preview
- Multiple tag input (add/remove tags)
- Form validation
- Loading state during upload
- Redirects to post detail on success

**State:**
```javascript
const [formData, setFormData] = useState({
  title: '',
  content: ''
});
const [coverImage, setCoverImage] = useState(null);
const [imagePreview, setImagePreview] = useState('');
const [tags, setTags] = useState([]);
const [currentTag, setCurrentTag] = useState('');
```

**Image Handling:**
```javascript
const handleImageChange = (e) => {
  const file = e.target.files[0];
  setCoverImage(file);
  setImagePreview(URL.createObjectURL(file));
};
```

**Submission:**
```javascript
const formDataToSend = new FormData();
formDataToSend.append('title', formData.title);
formDataToSend.append('content', formData.content);
if (coverImage) formDataToSend.append('coverImage', coverImage);
tags.forEach(tag => formDataToSend.append('tags[]', tag));
```

---

#### Edit Post (`/edit/:id`)

**Purpose:** Update existing post (author only)

**Features:**
- Pre-filled form with existing data
- Same validation as create
- Can change cover image
- Can update tags
- Only accessible by post author

**Flow:**
1. Fetch post data on mount
2. Verify user is author (redirect if not)
3. Pre-populate form
4. User edits
5. Submit with FormData
6. Redirect to post detail

---

#### Profile (`/profile/:userId`)

**Purpose:** Display user profile and posts

**Features:**
- User info (avatar, username, bio)
- Tab navigation (Posts, Liked Posts, Saved Posts)
- Edit profile button (only on own profile)
- Post statistics
- Grid of user's posts
- Empty states for each tab

**State:**
```javascript
const [profileUser, setProfileUser] = useState(null);
const [posts, setPosts] = useState([]);
const [activeTab, setActiveTab] = useState('posts');
```

**Tabs:**
- **Posts:** User's own posts
- **Liked:** Posts user has liked
- **Saved:** Posts user has saved

**API Calls:**
- `GET /api/posts/user/:userId` - User's posts
- `GET /api/auth/activity` - Statistics

---

#### Edit Profile (`/edit-profile`)

**Purpose:** Update user profile

**Features:**
- Avatar file upload with preview
- Bio textarea (max 500 chars)
- Current avatar display
- Cancel button returns to profile
- Loading state during upload

**State:**
```javascript
const [formData, setFormData] = useState({ bio: '' });
const [avatarFile, setAvatarFile] = useState(null);
const [avatarPreview, setAvatarPreview] = useState('');
```

**Avatar Preview:**
```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }
};
```

**Submission:**
```javascript
const formDataToSend = new FormData();
formDataToSend.append('bio', formData.bio);
if (avatarFile) formDataToSend.append('avatar', avatarFile);
```

---

#### My Posts (`/my-posts`)

**Purpose:** Manage user's own posts

**Features:**
- Grid of user's posts with cover images
- Edit/Delete/View buttons
- Post statistics (likes, comments)
- Empty state with CTA to create first post
- Refetches properly on navigation

**State:**
```javascript
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
```

**Key Fix:**
```javascript
useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }
  fetchMyPosts();
}, [user?.id]); // Uses user.id instead of user._id
```

**Delete Flow:**
```javascript
const handleDelete = async (postId) => {
  if (!confirm('Are you sure?')) return;
  await axios.delete(`/api/posts/${postId}`);
  setPosts(posts.filter(post => post._id !== postId));
};
```

---

### Legal & Information Pages

#### About (`/about`)

**Purpose:** Platform information and mission

**Sections:**
- Mission statement
- Features overview (what we offer)
- Platform values
- Contact information

**Design:** Clean, text-focused layout with section-based structure

---

#### Privacy Policy (`/privacy`)

**Purpose:** Privacy policy and data handling information

**Sections:**
- Information collection (personal & usage data)
- How we use your information
- Data security measures
- User rights (access, correct, delete, export)
- Cookie policy
- Contact information

**Last Updated:** November 25, 2025

---

#### Terms of Service (`/terms`)

**Purpose:** Terms and conditions for platform use

**Sections:**
- Agreement to terms
- User account rules
- Content guidelines (prohibited content)
- Intellectual property rights
- Content moderation policy
- Limitation of liability
- Account termination
- Changes to terms
- Contact information

**Last Updated:** November 25, 2025

---

### Admin Pages (Require Admin Authentication)

#### Admin Login (`/admin/login`)

**Purpose:** Admin authentication portal

**Features:**
- Separate from user login
- Email and password inputs
- Dark navy theme (#313647)
- Shield icon branding
- Stores adminToken separately

**State:**
```javascript
const [credentials, setCredentials] = useState({
  email: '',
  password: ''
});
```

**Authentication:**
- Uses separate `AdminAuthContext`
- Stores `adminToken` in localStorage
- Independent from user auth

---

#### Admin Dashboard (`/admin/dashboard`)

**Purpose:** Analytics and platform overview

**Features:**
- 4 stat cards:
  - Total Users
  - Total Posts
  - Total Comments (aggregated from all posts)
  - Active Users (posted in last 30 days)
- Recent users table (last 5)
- Recent posts table (last 5) with tags
- Real-time data
- Sidebar navigation

**State:**
```javascript
const [analytics, setAnalytics] = useState({
  totalUsers: 0,
  totalPosts: 0,
  totalComments: 0,
  activeUsers: 0,
  recentUsers: [],
  recentPosts: []
});
```

**API Call:**
- `GET /api/admin/dashboard`

---

#### User Management (`/admin/users`)

**Purpose:** Manage platform users

**Features:**
- Searchable user table
- Pagination (10 users per page)
- Status badges (Active/Restricted)
- Post count for each user (aggregated)
- Search by username or email
- Actions:
  - Restrict/Unrestrict with reason modal
  - Delete user

**State:**
```javascript
const [users, setUsers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [showRestrictionModal, setShowRestrictionModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [restrictionReason, setRestrictionReason] = useState('');
```

**Restriction Modal:**
```javascript
const handleRestrict = async () => {
  await axios.put(`/api/admin/users/${selectedUser._id}/restrict`, {
    isRestricted: !selectedUser.isRestricted,
    restrictedReason: restrictionReason
  });
  // Refresh users list
};
```

---

#### Post Management (`/admin/posts`)

**Purpose:** Moderate platform posts

**Features:**
- All posts including restricted
- Tag display (up to 2 visible, "+ X more")
- Comments count
- Status badges (Active/Restricted)
- Search functionality
- Pagination
- Actions:
  - Restrict/Unrestrict with reason
  - Delete post

**Table Columns:**
- Title
- Author
- Tags
- Status
- Comments
- Created Date
- Actions

---

## Components

### Navbar

**Location:** `src/components/Navbar.jsx`

**Purpose:** Main navigation bar for user portal

**Features:**
- Logo and platform name
- Search bar (navigates to home with query)
- Navigation links (conditional based on auth state)
- User menu dropdown (Profile, My Posts, Edit Profile, Logout)
- Mobile responsive hamburger menu
- Active route highlighting

**Props:** None (uses AuthContext)

**Conditional Rendering:**
```javascript
{isAuthenticated ? (
  // Show user menu
) : (
  // Show Login/Register links
)}
```

---

### PostCard

**Location:** `src/components/PostCard.jsx`

**Purpose:** Reusable post preview card

**Props:**
```javascript
{
  post: {
    _id,
    title,
    content,
    author: { username, avatar },
    coverImage,
    tags,
    likes,
    comments,
    createdAt
  }
}
```

**Features:**
- Cover image (if exists)
- Title and content excerpt (150 chars)
- Author info with avatar
- Tags (up to 3 shown)
- Like and comment counts
- Formatted date (date-fns)
- Click to navigate to post detail
- Hover effects

**Excerpt Generation:**
```javascript
const excerpt = post.content
  .replace(/<[^>]*>/g, '') // Strip HTML
  .substring(0, 150) + '...';
```

**Image Handling:**
```javascript
// Supports both external URLs and local uploads
src={post.coverImage.startsWith('http') 
  ? post.coverImage 
  : `http://localhost:5000${post.coverImage}`}
```

---

### Footer

**Location:** `src/components/Footer.jsx`

**Purpose:** Site-wide footer with navigation and branding

**Features:**
- BlogSpace branding with tagline
- Resources section (About, Privacy, Terms)
- Copyright notice: "© 2025 SiraajSaabir. All rights reserved."
- Responsive layout (stacks on mobile, spreads on desktop)
- Dark accent background (#313647)
- Hover effects on links

**Structure:**
- Left: Branding + tagline
- Right: Resources links
- Bottom: Copyright

---

### AdminSidebar

**Location:** `src/components/AdminSidebar.jsx`

**Purpose:** Admin panel navigation

**Features:**
- Admin info display (avatar, name)
- Navigation links:
  - Dashboard
  - User Management
  - Post Management
- Active route highlighting
- Logout button
- Fixed position on desktop
- Collapsible on mobile

**Styling:**
- Dark navy background (#313647)
- White text
- Hover effects on links
- Active state with different background

---

## Context & State Management

### AuthContext

**Location:** `src/context/AuthContext.jsx`

**Purpose:** Manage user authentication state

**Provided Values:**
```javascript
{
  user,              // Current user object
  setUser,           // Update user
  loading,           // Initial load state
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  isAuthenticated    // Boolean auth status
}
```

**Key Features:**

1. **Token Persistence:**
```javascript
useEffect(() => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    loadUser();
  }
}, [token]);
```

2. **Login Flow:**
```javascript
const login = async (credentials) => {
  const response = await authAPI.login(credentials);
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  setToken(token);
  setUser(user);
  return response.data;
};
```

3. **Logout:**
```javascript
const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  setToken(null);
  setUser(null);
};
```

**Critical Fix:**
- Sets axios headers on mount to persist auth on page refresh
- Uses `user.id` instead of `user._id` consistently

---

### AdminAuthContext

**Location:** `src/context/AdminAuthContext.jsx`

**Purpose:** Separate admin authentication

**Provided Values:**
```javascript
{
  admin,                    // Current admin object
  adminLogin,               // Admin login function
  adminLogout,              // Admin logout function
  isAdminAuthenticated,     // Boolean auth status
  loading                   // Initial load state
}
```

**Key Differences from AuthContext:**
- Uses `adminToken` instead of `token`
- Separate API endpoints (`/api/admin/*`)
- Independent state management
- Different localStorage key

**Why Separate?**
- Security: Admins shouldn't access user endpoints with admin token
- Clear separation of concerns
- Different permission levels
- Independent sessions

---

## Data Flow

### 1. Authentication Flow

```
User Enters Credentials
  ↓
Form Validation
  ↓
POST /api/auth/login
  ↓
Server validates & returns { token, user }
  ↓
Token stored in localStorage
  ↓
Context updated (setUser, setToken)
  ↓
Axios headers set globally
  ↓
Protected routes become accessible
  ↓
User redirected to home
```

**Persistence:**
```
Page Refresh
  ↓
App loads
  ↓
AuthContext checks localStorage for token
  ↓
If token exists → set axios headers & fetch user
  ↓
User state populated
  ↓
Protected routes accessible
```

---

### 2. Post Creation Flow

```
User fills form
  ↓
Client-side validation (title, content length)
  ↓
File selected → Create preview with URL.createObjectURL
  ↓
User submits
  ↓
Create FormData object
  ↓
Append: title, content, coverImage (File), tags[]
  ↓
POST /api/posts (multipart/form-data)
  ↓
Server receives request
  ↓
Multer processes file upload
  ↓
Validation (express-validator)
  ↓
Post saved to MongoDB
  ↓
File saved to uploads/ directory
  ↓
Response: { message, post }
  ↓
Client redirects to /post/:id
```

---

### 3. Like/Comment Flow

**Like:**
```
User clicks heart icon
  ↓
POST /api/posts/:id/like (with auth token)
  ↓
Server checks if user already liked
  ↓
If liked → remove from array (unlike)
  ↓
If not liked → add to array (like)
  ↓
Save post
  ↓
Return: { message, likes, isLiked }
  ↓
UI re-renders with new count and state
```

**Comment:**
```
User types comment
  ↓
User clicks submit
  ↓
POST /api/posts/:id/comments { text }
  ↓
Server creates comment object: { user, text, createdAt }
  ↓
Push to post.comments array
  ↓
Populate user data
  ↓
Return updated post
  ↓
UI re-renders with new comment
```

---

### 4. Admin Restriction Flow

**User Restriction:**
```
Admin clicks "Restrict User"
  ↓
Modal opens with textarea for reason
  ↓
Admin enters reason and confirms
  ↓
PUT /api/admin/users/:id/restrict
  {
    isRestricted: true,
    restrictedReason: "reason text"
  }
  ↓
Server updates user document
  ↓
Response: { message, user }
  ↓
Table re-renders with "Restricted" badge
  ↓
User attempts to login
  ↓
Server checks isRestricted field
  ↓
Returns 403 with restriction message
  ↓
Login fails with reason displayed
```

**Post Restriction:**
```
Admin clicks "Restrict Post"
  ↓
Modal opens
  ↓
Admin enters reason
  ↓
PUT /api/admin/posts/:id/restrict
  ↓
Server updates post.isRestricted = true
  ↓
Post hidden from home feed (query: { isRestricted: false })
  ↓
Post still accessible via direct URL
  ↓
Warning banner shown on post detail page
```

---

### 5. File Upload Flow

**Avatar Upload:**
```
User selects image file
  ↓
handleFileChange triggered
  ↓
setAvatarFile(file)
  ↓
setAvatarPreview(URL.createObjectURL(file))
  ↓
Preview shown in UI
  ↓
User submits form
  ↓
FormData created: formData.append('avatar', avatarFile)
  ↓
PUT /api/auth/profile (multipart/form-data)
  ↓
Multer middleware processes upload
  ↓
File saved to uploads/ as avatar-{timestamp}-{random}.{ext}
  ↓
Path stored in user.avatar: "/uploads/avatar-123.jpg"
  ↓
Response with updated user
  ↓
UI updates with new avatar
```

---

## Styling System

### Tailwind v4 Custom Theme

**Location:** `src/index.css`

**Configuration:**
```css
@theme {
  /* Primary - Cream Yellow */
  --color-primary-50: #fffefb;
  --color-primary-100: #fffdf7;
  /* ... through to ... */
  --color-primary-900: #d4b824;

  /* Secondary - Sage Green */
  --color-secondary-50: #f7f9f5;
  /* ... */
  --color-secondary-900: #39412e;

  /* Accent - Dark Navy */
  --color-accent-50: #f5f6f7;
  /* ... */
  --color-accent-900: #15171f;
}
```

**Body Styling:**
```css
body {
  background: linear-gradient(
    to bottom right,
    #fffefb,
    #fffdf7,
    #FFF8D4
  );
}
```

---

### Common Patterns

**Gradients:**
```jsx
className="bg-linear-to-r from-primary-500 to-secondary-500"
className="bg-linear-to-br from-primary-50 via-primary-100 to-secondary-50"
```

**Hover Effects:**
```jsx
className="hover:-translate-y-0.5 hover:shadow-lg transition-all"
className="hover:scale-105 transition-transform"
```

**Cards:**
```jsx
className="rounded-xl shadow-md border border-primary-200 hover:shadow-xl"
className="bg-white p-6 rounded-2xl shadow-lg"
```

**Buttons:**
```jsx
// Primary Button
className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"

// Secondary Button
className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"

// Danger Button
className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
```

**Badges:**
```jsx
// Tag Badge
className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"

// Status Badge (Active)
className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"

// Status Badge (Restricted)
className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold"
```

---

## Routing

**Location:** `src/App.jsx`

### Public Routes
```jsx
<Route path="/" element={<Home />} />
<Route path="/post/:id" element={<PostDetail />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/about" element={<About />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
```

### Protected Routes (User)
```jsx
<Route path="/create" element={<CreatePost />} />
<Route path="/edit/:id" element={<CreatePost />} />
<Route path="/profile" element={<Profile />} />
<Route path="/profile/edit" element={<EditProfile />} />
<Route path="/my-posts" element={<MyPosts />} />
```

**Note:** Protected routes check `authLoading` state before redirecting to prevent flash redirects on page refresh.

### Admin Routes
```jsx
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
<Route path="/admin/users" element={
  <AdminRoute>
    <UserManagement />
  </AdminRoute>
} />
<Route path="/admin/posts" element={
  <AdminRoute>
    <PostManagement />
  </AdminRoute>
} />
```

### Route Guards

**AdminRoute:**
```javascript
const AdminRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);
  
  if (loading) return <LoadingSpinner />;
  if (!admin) return <Navigate to="/admin/login" />;
  
  return children;
};
```

---

**Last Updated:** November 25, 2025
