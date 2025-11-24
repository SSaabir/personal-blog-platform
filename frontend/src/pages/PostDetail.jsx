import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(prevPost => ({ ...prevPost, likes: response.data.likes }));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/auth/save/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSaved(response.data.saved);
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting comment with token:', comment);
      const response = await axios.post(
        `http://localhost:5000/api/posts/${id}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response.data);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-20 h-20 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-semibold text-accent-500">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-6 rounded-xl shadow-md">
          <p className="font-semibold">⚠️ {error || 'Post not found'}</p>
        </div>
      </div>
    );
  }
    const likes = Array.isArray(post?.likes) ? post.likes : [];
    const isLiked = user && likes.includes(user.id);

    //const isLiked = user && post.likes?.includes(user.id);
    const postDate = post?.createdAt? new Date(post.createdAt): null;
    const commentDate = comment?.createdAt? new Date(comment.createdAt): null;
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {post.isRestricted && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ This Post Has Been Restricted</h3>
              <p className="text-red-700 font-semibold">
                {post.restrictedReason || 'This post has been restricted by administrators for violating community guidelines.'}
              </p>
              <p className="text-red-600 text-sm mt-2">
                You can still view the content below, but interactions are limited.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <article className="bg-primary-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-secondary-400">
        {post.coverImage && (
          <div className="relative h-[500px] overflow-hidden">
            <img
              src={post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:5000${post.coverImage}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

        <div className="p-8 md:p-14">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map(tag => (
              <span
                key={tag}
                className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-bold border-2 border-secondary-300 hover:scale-105 transition-transform"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-accent-500 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-10 pb-8 border-b-2 border-gray-200">
            <div className="w-14 h-14 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {post.author?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">
                {post.author?.username}
              </p>
              <p className="text-gray-600 font-medium">
                📅 {postDate ? format(postDate, 'MMMM dd, yyyy') : ''}
              </p>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none mb-8 *:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-bold [&>p]:text-gray-700 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex items-center gap-6 pt-8 border-t-2 border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl ${
                isLiked
                  ? 'bg-secondary-500 text-white scale-105'
                  : 'bg-gray-100 text-gray-700 hover:scale-105'
              }`}
            >
              <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
              <span>{post.likes?.length || 0} Likes</span>
            </button>
            <div className="flex items-center gap-2 text-gray-700 font-bold text-lg bg-gray-100 px-6 py-4 rounded-2xl">
              <span className="text-2xl">💬</span>
              <span>{post.comments?.length || 0} Comments</span>
            </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl ${
                isSaved
                  ? 'bg-accent-500 text-white scale-105'
                  : 'bg-gray-100 text-gray-700 hover:scale-105'
              }`}
            >
              <span className="text-2xl">{isSaved ? '🔖' : '📑'}</span>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </article>

      <div className="mt-12">
        <h2 className="text-4xl font-extrabold text-secondary-500 mb-8">
          💬 Comments
        </h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-10 bg-primary-100 p-8 rounded-2xl shadow-xl border-2 border-secondary-300">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts and join the conversation..."
              required
              rows="4"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all resize-none text-lg"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 px-8 py-3.5 bg-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 hover:bg-secondary-600"
            >
              {submitting ? '🔄 Posting...' : '🚀 Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-10 bg-primary-100 p-8 rounded-2xl border-2 border-secondary-300 text-center">
            <p className="text-gray-700 text-lg font-medium">
              Please{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-secondary-500 font-bold hover:underline"
              >
                login
              </button>
              {' '}to join the conversation 👋
            </p>
          </div>
        )}

        {post.comments?.length > 0 ? (
          <div className="space-y-5">
            {post.comments.map((comment, index) => (
              <div
                key={index}
                className="bg-primary-50 p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-secondary-200 hover:border-secondary-400"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                    {comment.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="font-bold text-gray-900 text-base">
                        {comment.user?.username}
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-gray-500 text-sm font-medium">
                        {commentDate ? format(commentDate, 'MMM dd, yyyy') : ''}
                      </p>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-base">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-linear-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
            <p className="text-2xl mb-2">💭</p>
            <p className="text-gray-600 text-lg font-semibold">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
