import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, Trash2, AlertCircle, Mail, Calendar, X, Ban, CheckCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [restrictModal, setRestrictModal] = useState(null);
  const [restrictReason, setRestrictReason] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        params: { page, limit: 20, search: searchQuery },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      setDeleteModal(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRestrict = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/restrict`, {
        reason: restrictReason
      });
      setRestrictModal(null);
      setRestrictReason('');
      fetchUsers();
    } catch (error) {
      console.error('Failed to restrict user:', error);
      alert(error.response?.data?.message || 'Failed to restrict user');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-linear-to-br from-primary-50 via-primary-100 to-secondary-50">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-accent-900 mb-2">User Management</h1>
            <p className="text-accent-600 text-lg">Manage all registered users</p>
          </div>

          <div className="bg-primary-50 border-2 border-secondary-200 rounded-2xl p-6 shadow-lg mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search users by username or email..."
                className="w-full pl-12 pr-4 py-4 border-2 border-secondary-300 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all text-lg bg-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-accent-600 font-semibold">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-primary-50 border-2 border-secondary-200 rounded-2xl p-12 text-center shadow-lg">
              <AlertCircle className="w-16 h-16 text-accent-400 mx-auto mb-4" />
              <p className="text-xl text-accent-600 font-semibold">No users found</p>
            </div>
          ) : (
            <>
              <div className="bg-primary-50 border-2 border-secondary-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary-100 border-b-2 border-secondary-300">
                      <tr>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">User</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Email</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Posts</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Status</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Joined</th>
                        <th className="text-left py-4 px-6 text-accent-900 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {user.username?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-accent-900 font-semibold">{user.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-accent-600">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-secondary-200 text-secondary-900 rounded-full font-semibold">
                              {user.postCount || 0}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {user.isRestricted ? (
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
                              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setRestrictModal(user);
                                  setRestrictReason(user.restrictedReason || '');
                                }}
                                className={`px-4 py-2 ${user.isRestricted ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md hover:shadow-lg`}
                              >
                                {user.isRestricted ? (
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
                                onClick={() => setDeleteModal(user)}
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
              {restrictModal.isRestricted ? 'Unrestrict User' : 'Restrict User'}
            </h2>
            <p className="text-accent-600 mb-2">
              {restrictModal.isRestricted ? 'Remove restriction from:' : 'Restrict user:'}
            </p>
            <p className="text-accent-900 font-bold mb-4 bg-secondary-100 p-3 rounded-lg">
              {restrictModal.username} ({restrictModal.email})
            </p>
            
            {!restrictModal.isRestricted && (
              <div className="mb-6">
                <label className="block text-accent-700 font-semibold mb-2">
                  Reason for restriction
                </label>
                <textarea
                  value={restrictReason}
                  onChange={(e) => setRestrictReason(e.target.value)}
                  placeholder="e.g., Violates community guidelines, spam, inappropriate behavior..."
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all bg-white min-h-[100px]"
                />
              </div>
            )}
            
            {restrictModal.isRestricted && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-semibold mb-1">Current restriction reason:</p>
                <p className="text-red-900">{restrictModal.restrictedReason}</p>
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
            
            <h2 className="text-2xl font-bold text-accent-900 mb-3">Delete User</h2>
            <p className="text-accent-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.username}</strong>? This will also delete all their posts and comments. This action cannot be undone.
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

export default UserManagement;
