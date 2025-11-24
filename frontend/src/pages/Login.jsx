import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [restrictionInfo, setRestrictionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRestrictionInfo(null);
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      const response = err.response?.data;
      if (response?.isRestricted) {
        setRestrictionInfo({
          message: response.message,
          reason: response.reason
        });
      } else {
        setError(response?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-secondary-500 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="bg-primary-50 p-12 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border-4 border-secondary-600">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-secondary-100 rounded-2xl mb-4">
            <span className="text-5xl">🔑</span>
          </div>
          <h2 className="text-4xl font-extrabold text-secondary-500 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 text-lg">Login to continue your journey</p>
        </div>

        {restrictionInfo && (
          <div className="bg-red-50 border-2 border-red-400 text-red-900 p-6 rounded-xl mb-6 shadow-lg">
            <div className="flex items-start gap-3 mb-3">
              <svg className="w-6 h-6 text-red-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold text-lg mb-2">🚫 {restrictionInfo.message}</p>
                <p className="font-semibold text-red-800 bg-red-100 p-3 rounded-lg">
                  {restrictionInfo.reason}
                </p>
                <p className="text-red-700 text-sm mt-3">
                  If you believe this is a mistake, please contact support.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-xl mb-6 shadow-md">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-800 font-semibold text-sm">
              📧 Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-gray-800 font-semibold text-sm">
              🔒 Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength={6}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:bg-secondary-600"
          >
            {loading ? '🔄 Logging in...' : '🚀 Login Now'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-base">
          Don't have an account?{' '}
          <Link to="/register" className="bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold hover:underline">
            Register here →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
