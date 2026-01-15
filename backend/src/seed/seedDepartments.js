import dotenv from 'dotenv';
import prisma from '../config/database.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

dotenv.config();

// ESUT Departments organized by Faculty
const departmentsByFaculty = {
  'Faculty of Agricultural & Natural Resources Management': [
    'Agricultural Economics & Extension',
    'Animal Science',
    'Crop Science',
    'Fisheries & Aquaculture',
    'Food Science & Technology',
    'Forestry & Wildlife Management',
    'Soil Science',
  ],
  'Faculty of Applied Natural Sciences': [
    'Biochemistry',
    'Industrial Chemistry',
    'Industrial Mathematics',
    'Industrial Physics',
    'Microbiology',
    'Statistics',
  ],
  'Faculty of Basic Medical Sciences': [
    'Anatomy',
    'Medical Biochemistry',
    'Physiology',
  ],
  'Faculty of Clinical Medicine': [
    'Medicine',
    'Surgery',
    'Paediatrics',
    'Obstetrics & Gynaecology',
    'Community Medicine',
  ],
  'Faculty of Education': [
    'Arts Education',
    'Educational Foundations',
    'Science Education',
    'Health & Physical Education',
    'Library & Information Science',
    'Guidance & Counselling',
  ],
  'Faculty of Engineering': [
    'Agricultural & Bioresources Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Metallurgical & Materials Engineering',
  ],
  'Faculty of Environmental Sciences': [
    'Architecture',
    'Building',
    'Estate Management',
    'Fine & Applied Arts',
    'Geography & Meteorology',
    'Quantity Surveying',
    'Surveying & Geoinformatics',
    'Urban & Regional Planning',
  ],
  'Faculty of Law': [
    'Private & Property Law',
    'Public & International Law',
    'Commercial & Industrial Law',
  ],
  'Faculty of Management Sciences': [
    'Accountancy',
    'Banking & Finance',
    'Business Administration',
    'Marketing',
    'Public Administration',
    'Cooperative Economics & Management',
  ],
  'Faculty of Pharmaceutical Sciences': [
    'Pharmaceutical Chemistry',
    'Pharmacognosy',
    'Pharmacology & Toxicology',
    'Pharmaceutics & Pharmaceutical Technology',
    'Clinical Pharmacy & Pharmacy Management',
  ],
  'Faculty of Social Sciences and Humanities': [
    'Economics',
    'English & Literary Studies',
    'History & International Studies',
    'Mass Communication',
    'Philosophy',
    'Political Science',
    'Psychology',
    'Religious Studies',
    'Sociology & Anthropology',
  ],
  'Faculty of Physical Sciences': [
    'Computer Science',
    'Geology & Mining',
    'Mathematics',
    'Physics',
    'Chemistry',
  ],
  'Faculty of Biological Sciences': [
    'Applied Biology',
    'Botany',
    'Zoology',
    'Microbiology',
  ],
  'Faculty of Allied Health Science': [
    'Medical Laboratory Science',
    'Nursing Science',
    'Public Health',
    'Radiography & Radiological Science',
    'Optometry',
  ],
};

const seedDepartments = async () => {
  try {
    console.log('🏛️  Starting department seeding...\n');

    await connectDatabase();

    // Get all existing faculties
    const faculties = await prisma.faculty.findMany();
    console.log(`📊 Found ${faculties.length} faculties\n`);

    if (faculties.length === 0) {
      console.log('❌ No faculties found. Please run seed:faculties first.');
      return;
    }

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const faculty of faculties) {
      const departments = departmentsByFaculty[faculty.name];

      if (!departments) {
        console.log(`⚠️  No departments defined for: ${faculty.name}`);
        continue;
      }

      console.log(`\n📁 ${faculty.name}`);

      // Get existing departments for this faculty
      const existingDepts = await prisma.department.findMany({
        where: { facultyId: faculty.id },
      });
      const existingNames = existingDepts.map(d => d.name.toLowerCase());

      for (const deptName of departments) {
        if (existingNames.includes(deptName.toLowerCase())) {
          console.log(`   ⏭️  Skipping (exists): ${deptName}`);
          totalSkipped++;
        } else {
          await prisma.department.create({
            data: {
              name: deptName,
              facultyId: faculty.id,
            },
          });
          console.log(`   ✅ Created: ${deptName}`);
          totalCreated++;
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY:');
    console.log(`   • Departments created: ${totalCreated}`);
    console.log(`   • Departments skipped (already exist): ${totalSkipped}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Department seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

seedDepartments();
