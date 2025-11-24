import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/analytics/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8 bg-linear-to-br from-primary-50 via-primary-100 to-secondary-50">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-accent-600 font-semibold">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
    },
    {
      title: 'Total Comments',
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: TrendingUp,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-linear-to-br from-primary-50 via-primary-100 to-secondary-50">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-accent-900 mb-2">Dashboard</h1>
            <p className="text-accent-600 text-lg">Overview of your blog platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-accent-600 font-semibold mb-1">{stat.title}</h3>
                <p className="text-4xl font-bold text-accent-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {stats?.recentUsers && stats.recentUsers.length > 0 && (
            <div className="bg-primary-50 border-2 border-secondary-200 rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-2xl font-bold text-accent-900 mb-4">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-secondary-200">
                      <th className="text-left py-3 px-4 text-accent-700 font-semibold">Username</th>
                      <th className="text-left py-3 px-4 text-accent-700 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-accent-700 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((user) => (
                      <tr key={user._id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                        <td className="py-3 px-4 text-accent-900 font-medium">{user.username}</td>
                        <td className="py-3 px-4 text-accent-600">{user.email}</td>
                        <td className="py-3 px-4 text-accent-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {stats?.recentPosts && stats.recentPosts.length > 0 && (
            <div className="bg-primary-50 border-2 border-secondary-200 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-accent-900 mb-4">Recent Posts</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-secondary-200">
                      <th className="text-left py-3 px-4 text-accent-700 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 text-accent-700 font-semibold">Author</th>
                      <th className="text-left py-3 px-4 text-accent-700 font-semibold">Tags</th>
                      <th className="text-left py-3 px-4 text-accent-700 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPosts.map((post) => (
                      <tr key={post._id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                        <td className="py-3 px-4 text-accent-900 font-medium">{post.title}</td>
                        <td className="py-3 px-4 text-accent-600">{post.author?.username}</td>
                        <td className="py-3 px-4">
                          {post.tags && post.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-secondary-200 text-secondary-800 rounded-full text-xs font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-accent-400 text-sm">No tags</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-accent-600">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
