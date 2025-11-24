import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { Trash2, AlertCircle, User, Calendar, Tag, X, ExternalLink, Ban, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [restrictModal, setRestrictModal] = useState(null);
  const [restrictReason, setRestrictReason] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/posts', {
        params: { page, limit: 20 },
      });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/posts/${postId}`);
      setDeleteModal(null);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleRestrict = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/posts/${postId}/restrict`, {
        reason: restrictReason
      });
      setRestrictModal(null);
      setRestrictReason('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to restrict post:', error);
      alert(error.response?.data?.message || 'Failed to restrict post');
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-linear-to-br from-primary-50 via-primary-100 to-secondary-50">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-accent-900 mb-2">Post Management</h1>
            <p className="text-accent-600 text-lg">Manage all blog posts</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-accent-600 font-semibold">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-primary-50 border-2 border-secondary-200 rounded-2xl p-12 text-center shadow-lg">
              <AlertCircle className="w-16 h-16 text-accent-400 mx-auto mb-4" />
              <p className="text-xl text-accent-600 font-semibold">No posts found</p>
            </div>
          ) : (
            <>
              <div className="bg-primary-50 border-2 border-secondary-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary-100 border-b-2 border-secondary-300">
                      <tr>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Post</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Author</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Tags</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Comments</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Status</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Created</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post._id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {post.coverImage && (
                                <img
                                  src={post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:5000${post.coverImage}`}
                                  alt=""
                                  className="w-16 h-16 rounded-lg object-cover shadow-md"
                                />
                              )}
                              <div className="max-w-md">
                                <p className="text-accent-900 font-semibold line-clamp-2">{post.title}</p>
                                <Link
                                  to={`/post/${post._id}`}
                                  target="_blank"
                                  className="text-secondary-600 hover:text-secondary-700 text-sm flex items-center gap-1 mt-1"
                                >
                                  View post <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {post.author?.username?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-accent-600 font-medium">{post.author?.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-secondary-600" />
                              <div className="flex flex-wrap gap-1">
                                {post.tags && post.tags.length > 0 ? (
                                  post.tags.slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-secondary-200 text-secondary-900 rounded-full font-medium text-xs">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-accent-400 text-sm">No tags</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full font-semibold">
                              {post.comments?.length || 0}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {post.isRestricted ? (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold flex items-center gap-1 w-fit">
                                <Ban className="w-3 h-3" />
                                Restricted
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-accent-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setRestrictModal(post);
                                  setRestrictReason(post.restrictedReason || '');
                                }}
                                className={`px-4 py-2 ${post.isRestricted ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md hover:shadow-lg`}
                              >
                                {post.isRestricted ? (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Unrestrict
                                  </>
                                ) : (
                                  <>
                                    <Ban className="w-4 h-4" />
                                    Restrict
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => setDeleteModal(post)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-3 bg-secondary-500 text-white rounded-lg font-semibold hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-6 py-3 bg-primary-50 border-2 border-secondary-300 rounded-lg font-bold text-accent-900">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-6 py-3 bg-secondary-500 text-white rounded-lg font-semibold hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {restrictModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-primary-50 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-orange-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                <Ban className="w-8 h-8 text-orange-600" />
              </div>
              <button
                onClick={() => {
                  setRestrictModal(null);
                  setRestrictReason('');
                }}
                className="text-accent-400 hover:text-accent-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-accent-900 mb-3">
              {restrictModal.isRestricted ? 'Unrestrict Post' : 'Restrict Post'}
            </h2>
            <p className="text-accent-600 mb-2">
              {restrictModal.isRestricted ? 'Remove restriction from:' : 'Restrict post:'}
            </p>
            <p className="text-accent-900 font-bold mb-4 bg-secondary-100 p-3 rounded-lg">
              "{restrictModal.title}"
            </p>
            
            {!restrictModal.isRestricted && (
              <div className="mb-6">
                <label className="block text-accent-700 font-semibold mb-2">
                  Reason for restriction
                </label>
                <textarea
                  value={restrictReason}
                  onChange={(e) => setRestrictReason(e.target.value)}
                  placeholder="e.g., Violates community guidelines, inappropriate content..."
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all bg-white min-h-[100px]"
                />
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRestrictModal(null);
                  setRestrictReason('');
                }}
                className="flex-1 px-6 py-3 bg-accent-200 text-accent-900 rounded-xl font-semibold hover:bg-accent-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRestrict(restrictModal._id)}
                className={`flex-1 px-6 py-3 ${restrictModal.isRestricted ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-xl font-semibold transition-all shadow-lg`}
              >
                {restrictModal.isRestricted ? 'Unrestrict' : 'Restrict'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-primary-50 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-red-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <button
                onClick={() => setDeleteModal(null)}
                className="text-accent-400 hover:text-accent-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-accent-900 mb-3">Delete Post</h2>
            <p className="text-accent-600 mb-2">
              Are you sure you want to delete:
            </p>
            <p className="text-accent-900 font-bold mb-4 bg-secondary-100 p-3 rounded-lg">
              "{deleteModal.title}"
            </p>
            <p className="text-accent-600 mb-6 text-sm">
              This will also delete all comments on this post. This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-6 py-3 bg-accent-200 text-accent-900 rounded-xl font-semibold hover:bg-accent-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal._id)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
