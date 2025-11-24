import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=random&name='
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  isRestricted: {
    type: Boolean,
    default: false
  },
  restrictedReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Auto-generate avatar URL based on username
userSchema.pre('save', function(next) {
  if (!this.avatar || this.avatar === 'https://ui-avatars.com/api/?background=random&name=') {
    this.avatar = `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(this.username)}`;
  }
  next();
});

export default mongoose.model('User', userSchema);
