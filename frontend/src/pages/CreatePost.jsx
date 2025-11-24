import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const post = response.data;
      
      setFormData({
        title: post.title,
        content: post.content,
        tags: post.tags.join(', '),
        image: null
      });
      
      if (post.coverImage) {
        setExistingImage(post.coverImage);
        setPreview(post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:5000${post.coverImage}`);
      }
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (formData.tags) {
        formData.tags.split(',').map(tag => tag.trim()).forEach(tag => data.append('tags[]', tag));
      }
      if (formData.image) {
        data.append('image', formData.image);
      }

      const token = localStorage.getItem('token');
      const url = isEditMode 
        ? `http://localhost:5000/api/posts/${id}`
        : 'http://localhost:5000/api/posts';
      
      const method = isEditMode ? 'put' : 'post';

      await axios[method](url, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/my-posts');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} post`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {isEditMode ? 'Edit Post' : 'Create New Post'}
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-primary-50 p-8 rounded-xl shadow-lg border-4 border-secondary-300">
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 text-gray-700 font-semibold text-lg">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter an engaging title..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary-500 transition-colors text-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold text-lg">
            Content
          </label>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-secondary-500 transition-colors">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              placeholder="Write your story..."
              className="bg-primary-50 [&_.ql-container]:min-h-[300px] [&_.ql-editor]:text-base"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="tags" className="block mb-2 text-gray-700 font-semibold text-lg">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="technology, lifestyle, travel (comma-separated)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
          <p className="mt-2 text-sm text-gray-500">
            Separate tags with commas
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="image" className="block mb-2 text-gray-700 font-semibold text-lg">
            Featured Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
          />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg shadow-md max-h-96 object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 bg-linear-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Post' : 'Publish Post')}
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

export default CreatePost;
