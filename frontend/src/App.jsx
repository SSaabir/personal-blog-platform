import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import MyPosts from './pages/MyPosts';
import EditProfile from './pages/EditProfile';
import Profile from './pages/Profile';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PostManagement from './pages/admin/PostManagement';
import { useContext } from 'react';
import AdminAuthContext from './context/AdminAuthContext';
import './App.css';

// Protected route for admin pages
const AdminRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 via-primary-100 to-secondary-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-accent-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  
  return admin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <AdminRoute>
                  <PostManagement />
                </AdminRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-linear-to-br from-primary-50 via-primary-100 to-secondary-50 flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/create" element={<CreatePost />} />
                      <Route path="/edit/:id" element={<CreatePost />} />
                      <Route path="/post/:id" element={<PostDetail />} />
                      <Route path="/my-posts" element={<MyPosts />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<EditProfile />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
