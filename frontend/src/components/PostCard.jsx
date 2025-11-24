import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }

    try {
      const response = await postsAPI.likePost(post._id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to save posts');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/save/${post._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setIsSaved(data.saved);
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const truncateContent = (html, maxLength = 150) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Link to={`/post/${post._id}`} className="block bg-primary-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-secondary-300 hover:border-secondary-500 hover:-translate-y-2">
      {post.coverImage && (
        <div className="relative h-56 overflow-hidden">
          <img 
            src={post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:5000${post.coverImage}`} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}
      
      <div className="p-7">
        <h3 className="text-2xl font-extrabold text-accent-500 mb-4 group-hover:text-secondary-500 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>
        
        <p className="text-gray-700 mb-5 line-clamp-3 leading-relaxed text-base">
          {truncateContent(post.content)}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags?.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold border-2 border-secondary-300 hover:scale-105 transition-transform"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {post.author?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-accent-500 text-sm">{post.author?.username}</p>
              <p className="text-gray-600 text-xs font-medium">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                isLiked 
                  ? 'bg-secondary-500 text-white scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isLiked ? '❤️' : '🤍'} {likesCount}
            </button>
            <span className="text-gray-700 font-semibold text-sm bg-gray-100 px-3 py-2 rounded-xl">
              💬 {post.comments?.length || 0}
            </span>
            <button
              onClick={handleSave}
              className={`p-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                isSaved 
                  ? 'bg-accent-500 text-white scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isSaved ? 'Unsave post' : 'Save post'}
            >
              {isSaved ? '🔖' : '📑'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
