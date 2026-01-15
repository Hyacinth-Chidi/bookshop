import dotenv from 'dotenv';
import prisma from '../config/database.js';
import { hashPassword } from '../utils/password.util.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting admin seeding...\n');

    await connectDatabase();

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log('\n💡 To create a new admin, first delete the existing one.');
      return;
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin@123456');
    
    const admin = await prisma.admin.create({
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@esut.edu.ng',
        password: adminPassword,
        role: 'admin',
      },
    });
    
    console.log('✅ Admin created:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}\n`);

    console.log('\n✨ Admin seeding completed successfully!\n');

  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

seedAdmin();
