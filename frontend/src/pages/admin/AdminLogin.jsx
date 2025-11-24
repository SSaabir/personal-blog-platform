import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAuthContext from '../../context/AdminAuthContext';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-accent-800 via-accent-700 to-accent-600 flex items-center justify-center px-6 py-12">
      <div className="bg-primary-50 p-12 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border-4 border-accent-500">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-linear-to-br from-accent-500 to-accent-700 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-2 text-accent-900">Admin Portal</h1>
        <p className="text-center text-accent-600 mb-8 text-lg">Secure access for administrators</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-accent-700 font-semibold mb-2 text-lg">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-accent-200 rounded-xl focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all text-lg bg-white"
                placeholder="admin@blogspace.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-accent-700 font-semibold mb-2 text-lg">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-accent-200 rounded-xl focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all text-lg bg-white"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:bg-accent-700"
          >
            {loading ? 'Logging in...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-accent-600 text-sm">
            Authorized personnel only. All access is logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
