import dotenv from 'dotenv';
import prisma from '../config/database.js';
import { hashPassword } from '../utils/password.util.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

dotenv.config();

// ESUT Faculties
const faculties = [
  'Faculty of Agricultural & Natural Resources Management',
  'Faculty of Applied Natural Sciences',
  'Faculty of Basic Medical Sciences',
  'Faculty of Clinical Medicine',
  'Faculty of Education',
  'Faculty of Engineering',
  'Faculty of Environmental Sciences',
  'Faculty of Law',
  'Faculty of Management Sciences',
  'Faculty of Pharmaceutical Sciences',
  'Faculty of Social Sciences and Humanities',
  'Faculty of Physical Sciences',
  'Faculty of Biological Sciences',
  'Faculty of Allied Health Science',
];

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    await connectDatabase();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Cleaning existing data...');
    await prisma.purchase.deleteMany();
    await prisma.student.deleteMany();
    await prisma.book.deleteMany();
    await prisma.department.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.admin.deleteMany();
    console.log('✅ Existing data cleaned\n');

    // Create faculties
    console.log('🏛️  Creating faculties...');
    const createdFaculties = [];
    for (const facultyName of faculties) {
      const faculty = await prisma.faculty.create({
        data: { name: facultyName },
      });
      createdFaculties.push(faculty);
    }
    console.log(`✅ Created ${createdFaculties.length} faculties\n`);

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

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY:');
    console.log(`   • Faculties: ${createdFaculties.length}`);
    console.log(`   • Admin users: 1`);
    console.log(`   • Books created: 0`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 You can now start the server with: npm run dev\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

seed();
