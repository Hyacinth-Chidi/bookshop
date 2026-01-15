import dotenv from 'dotenv';
import prisma from '../config/database.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

dotenv.config();

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover';
const PLACEHOLDER_MANUAL = 'https://placehold.co/400x600/fbbf24/78350f?text=Manual';

// Helper to generate a course code from department name
const getCourseCode = (deptName, level) => {
  const words = deptName.split(' ');
  let code = '';
  if (words.length === 1) {
    code = words[0].substring(0, 3).toUpperCase();
  } else {
    code = words
      .filter(w => w.length > 2 && w !== 'and' && w !== 'for')
      .map(w => w[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();
  }
  return `${code} ${level}1`; // e.g., CSC 101
};

const getRandomLecturer = () => {
  const lecturers = [
    'Dr. Okonkwo', 'Prof. Nnamdi', 'Dr. Mrs. Obi', 'Prof. Eze', 
    'Dr. Chukwu', 'Prof. Ibrahim', 'Dr. Adebayo', 'Prof. Okafor'
  ];
  return lecturers[Math.floor(Math.random() * lecturers.length)];
};

const seedBooks = async () => {
  try {
    console.log('📚 Starting book seeding...\n');

    await connectDatabase();

    // Get all departments with their faculty
    const departments = await prisma.department.findMany({
      include: { faculty: true }
    });

    console.log(`📊 Found ${departments.length} departments. Generating books...`);
    
    if (departments.length === 0) {
      console.log('❌ No departments found. Please run seed:departments first.');
      return;
    }

    let createdCount = 0;

    for (const dept of departments) {
      // Check if books already exist for this department (to avoid duplicates if run multiple times)
      const existingBooks = await prisma.book.count({
        where: { departmentId: dept.id }
      });

      if (existingBooks >= 2) {
        process.stdout.write('.'); // progress indicator for skips
        continue;
      }

      // Book 1: With Manual (100 Level)
      await prisma.book.create({
        data: {
          title: `Introduction to ${dept.name}`,
          description: `A comprehensive introduction covering the fundamentals of ${dept.name}. Essential for fresh students.`,
          price: 1500 + Math.floor(Math.random() * 1000),
          courseCode: getCourseCode(dept.name, 1),
          facultyId: dept.facultyId,
          departmentId: dept.id,
          level: '100 Level',
          semester: 'First Semester',
          session: '2024/2025',
          frontCover: PLACEHOLDER_IMAGE,
          backCover: PLACEHOLDER_IMAGE,
          
          // Manual Details
          hasManual: true,
          manualPrice: 1000 + Math.floor(Math.random() * 500),
          manualFrontCover: PLACEHOLDER_MANUAL,
          
          courseLecturer: getRandomLecturer(),
          quantity: 50 + Math.floor(Math.random() * 100),
        }
      });

      // Book 2: No Manual (200 Level)
      await prisma.book.create({
        data: {
          title: `Advanced ${dept.name} Concepts`,
          description: `An in-depth exploration of advanced topics in ${dept.name}. Designed for second year students.`,
          price: 2500 + Math.floor(Math.random() * 1500),
          courseCode: getCourseCode(dept.name, 2),
          facultyId: dept.facultyId,
          departmentId: dept.id,
          level: '200 Level',
          semester: 'Second Semester',
          session: '2024/2025',
          frontCover: PLACEHOLDER_IMAGE,
          backCover: PLACEHOLDER_IMAGE,
          
          // No Manual
          hasManual: false,
          manualPrice: null,
          manualFrontCover: null,
          
          courseLecturer: getRandomLecturer(),
          quantity: 30 + Math.floor(Math.random() * 50),
        }
      });

      createdCount += 2;
      process.stdout.write('✅'); // progress indicator
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY:');
    console.log(`   • Books created: ${createdCount}`);
    console.log(`   • Total Departments processed: ${departments.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Book seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

seedBooks();
