import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Super admin already exists!');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Username:', existingSuperAdmin.username);
      process.exit(0);
    }

    // Create super admin credentials
    const superAdminData = {
      username: 'superadmin',
      email: 'admin@blogspace.com',
      password: 'Admin@123456', // Change this in production!
      role: 'super-admin',
      permissions: {
        canManageUsers: true,
        canManagePosts: true,
        canManageAdmins: true,
        canViewAnalytics: true
      },
      isActive: true
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(superAdminData.password, 10);

    // Create super admin
    const superAdmin = new Admin({
      ...superAdminData,
      password: hashedPassword
    });

    await superAdmin.save();

    console.log('✅ Super Admin created successfully!');
    console.log('');
    console.log('=================================');
    console.log('SUPER ADMIN CREDENTIALS');
    console.log('=================================');
    console.log('Email:', superAdminData.email);
    console.log('Password:', superAdminData.password);
    console.log('=================================');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
