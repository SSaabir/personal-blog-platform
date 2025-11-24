import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData({
      bio: user.bio || '',
    });
    setAvatarPreview(user.avatar || '');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('bio', formData.bio);
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formDataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update user context
      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Profile</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-linear-to-br from-white via-primary-50 to-secondary-50 p-8 rounded-xl shadow-lg border border-primary-200">
        <div className="mb-6">
          <div className="flex items-center gap-6 mb-6">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-secondary-200"
              />
            ) : (
              <div className="w-24 h-24 bg-linear-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="avatar" className="block mb-2 text-gray-700 font-semibold text-lg">
            Profile Picture
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-500 file:text-white hover:file:bg-secondary-600 cursor-pointer"
          />
          <p className="mt-2 text-sm text-gray-500">
            Upload a new profile picture (JPG, PNG, GIF)
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="bio" className="block mb-2 text-gray-700 font-semibold text-lg">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="4"
            maxLength="500"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
          />
          <p className="mt-2 text-sm text-gray-500">
            {formData.bio.length}/500 characters
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 bg-linear-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
