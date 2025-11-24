import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('liked');
  const [activity, setActivity] = useState({
    likedPosts: [],
    commentedPosts: [],
    savedPosts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivity(response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPosts = (posts) => {
    if (posts.length === 0) {
      return (
        <div className="text-center py-16 bg-linear-to-br from-primary-50 via-white to-secondary-50 rounded-2xl border border-primary-200">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 text-lg">No posts yet</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        {posts.map(post => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="block bg-linear-to-br from-white to-primary-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-primary-200 hover:border-secondary-300"
          >
            <div className="flex gap-6">
              {post.coverImage && (
                <img
                  src={post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:5000${post.coverImage}`}
                  alt={post.title}
                  className="w-32 h-32 object-cover rounded-xl shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-linear-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {post.author?.username?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium">{post.author?.username}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    ❤️ {post.likes?.length || 0} likes
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {post.comments?.length || 0} comments
                  </span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-linear-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-xs font-semibold border border-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-linear-to-br from-white via-primary-50 to-secondary-50 p-8 rounded-3xl shadow-xl mb-8 border border-primary-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-linear-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                {user?.username}
              </h1>
              <p className="text-gray-600 text-lg">{user?.email}</p>
              {user?.bio && (
                <p className="text-gray-700 mt-3 max-w-2xl">{user.bio}</p>
              )}
            </div>
          </div>
          <Link
            to="/profile/edit"
            className="px-6 py-3 bg-linear-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            ✏️ Edit Profile
          </Link>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-primary-200">
          <div className="text-center">
            <div className="text-3xl font-bold bg-linear-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              {activity.likedPosts.length}
            </div>
            <div className="text-gray-600 font-medium mt-1">❤️ Liked Posts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              {activity.commentedPosts.length}
            </div>
            <div className="text-gray-600 font-medium mt-1">💬 Commented Posts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-linear-to-r from-accent-500 to-secondary-500 bg-clip-text text-transparent">
              {activity.savedPosts.length}
            </div>
            <div className="text-gray-600 font-medium mt-1">🔖 Saved Posts</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 bg-primary-50/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-secondary-200">
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            activeTab === 'liked'
              ? 'bg-linear-to-r from-red-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-700 hover:bg-primary-50'
          }`}
        >
          ❤️ Liked Posts
        </button>
        <button
          onClick={() => setActiveTab('commented')}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            activeTab === 'commented'
              ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : 'text-gray-700 hover:bg-primary-50'
          }`}
        >
          💬 Commented Posts
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            activeTab === 'saved'
              ? 'bg-linear-to-r from-accent-500 to-secondary-500 text-white shadow-lg'
              : 'text-gray-700 hover:bg-primary-50'
          }`}
        >
          🔖 Saved Posts
        </button>
      </div>

      {/* Posts Content */}
      <div>
        {activeTab === 'liked' && renderPosts(activity.likedPosts)}
        {activeTab === 'commented' && renderPosts(activity.commentedPosts)}
        {activeTab === 'saved' && renderPosts(activity.savedPosts)}
      </div>
    </div>
  );
};

export default Profile;
