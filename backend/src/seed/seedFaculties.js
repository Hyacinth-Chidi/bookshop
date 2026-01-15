import dotenv from 'dotenv';
import prisma from '../config/database.js';
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

const seedFaculties = async () => {
  try {
    console.log('🏛️  Starting faculty seeding...\n');

    await connectDatabase();

    // Check existing faculties
    const existingFaculties = await prisma.faculty.findMany();
    const existingNames = existingFaculties.map(f => f.name.toLowerCase());
    
    console.log(`📊 Found ${existingFaculties.length} existing faculties\n`);

    // Add only new faculties (skip duplicates)
    let created = 0;
    let skipped = 0;

    for (const facultyName of faculties) {
      if (existingNames.includes(facultyName.toLowerCase())) {
        console.log(`⏭️  Skipping (exists): ${facultyName}`);
        skipped++;
      } else {
        await prisma.faculty.create({
          data: { name: facultyName },
        });
        console.log(`✅ Created: ${facultyName}`);
        created++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY:');
    console.log(`   • Faculties created: ${created}`);
    console.log(`   • Faculties skipped (already exist): ${skipped}`);
    console.log(`   • Total faculties now: ${existingFaculties.length + created}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Faculty seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

seedFaculties();
