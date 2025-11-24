import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.errors?.[0]?.msg ||
                       'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-secondary-500 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="bg-primary-50 p-12 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border-4 border-secondary-600">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-secondary-100 rounded-2xl mb-4">
            <span className="text-5xl">🚀</span>
          </div>
          <h2 className="text-4xl font-extrabold text-secondary-500 mb-2">Join Us!</h2>
          <p className="text-gray-600 text-lg">Start your blogging journey today</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-xl mb-6 shadow-md">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-2 text-gray-800 font-semibold text-sm">
              👤 Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a cool username"
              minLength={3}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all shadow-sm"
            />
          </div>

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
              placeholder="Create a strong password"
              minLength={6}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-800 font-semibold text-sm">
              ✅ Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength={6}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:bg-secondary-600"
          >
            {loading ? '🔄 Creating account...' : '✨ Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-base">
          Already have an account?{' '}
          <Link to="/login" className="bg-linear-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent font-bold hover:underline">
            Login here →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
