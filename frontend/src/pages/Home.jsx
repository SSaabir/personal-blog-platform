import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, selectedTag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 }; // Fetch up to 100 posts
      if (searchTerm) params.search = searchTerm;
      if (selectedTag) params.tags = selectedTag;

      const response = await axios.get('http://localhost:5000/api/posts', { params });
      setPosts(response.data.posts);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);    
    }
  };

  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-secondary-500 text-white py-20 px-6 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-500/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            🌟 Discover Amazing Stories
          </h1>
          <p className="text-2xl md:text-3xl text-white/95 font-light">
            Explore thoughts, ideas, and experiences from our creative community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">

      <div className="mb-10 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search amazing posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-secondary-300 rounded-2xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all text-lg shadow-md bg-primary-50"
            />
          </div>
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-6 py-4 border-2 border-secondary-300 rounded-2xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all bg-primary-50 cursor-pointer text-lg font-semibold min-w-[220px] shadow-md"
        >
          <option value="">🏷️ All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-5 rounded-xl mb-8 shadow-md">
          <p className="font-semibold">⚠️ {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32">
          <div className="w-20 h-20 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold text-accent-500">Loading amazing posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-32 bg-primary-50 rounded-3xl shadow-lg border-4 border-secondary-300">
          <p className="text-3xl mb-3">💭</p>
          <p className="text-2xl font-bold text-accent-500 mb-2">No posts found</p>
          <p className="text-lg text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
