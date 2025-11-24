import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const MyPosts = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyPosts();
  }, [user?.id, authLoading]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/posts/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch your posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      alert('Failed to delete post');
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Posts</h1>
          <p className="text-xl text-gray-600">Manage your published content</p>
        </div>
        <Link
          to="/create"
          className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          ➕ Create New Post
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-linear-to-br from-primary-50 via-white to-secondary-50 rounded-xl shadow-lg border border-primary-200">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Posts Yet</h2>
          <p className="text-gray-600 mb-6">Start sharing your thoughts with the world!</p>
          <Link
            to="/create"
            className="inline-block px-8 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map(post => (
            <div
              key={post._id}
              className="bg-linear-to-br from-white to-primary-50 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden border border-primary-200 hover:border-secondary-300"
            >
              <div className="flex flex-col md:flex-row">
                {post.coverImage && (
                  <img
                    src={post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:5000${post.coverImage}`}
                    alt={post.title}
                    className="w-full md:w-64 h-48 object-cover"
                  />
                )}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-primary bg-opacity-10 text-black rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-primary transition-colors">
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📅 {format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                    <span>❤️ {post.likes?.length || 0} likes</span>
                    <span>💬 {post.comments?.length || 0} comments</span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/edit/${post._id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                    <Link
                      to={`/post/${post._id}`}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      👁️ View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
