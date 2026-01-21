import dotenv from 'dotenv';
import prisma from '../config/database.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

dotenv.config();

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover';
const PLACEHOLDER_MANUAL = 'https://placehold.co/400x600/fbbf24/78350f?text=Manual';

// Department code mappings for realistic course codes
const DEPT_CODES = {
  'Computer Science': 'CSC',
  'Computer Engineering': 'CPE',
  'Electrical & Electronics Engineering': 'EEE',
  'Mechanical Engineering': 'MEE',
  'Civil Engineering': 'CVE',
  'Chemical Engineering': 'CHE',
  'Agricultural & Bioresources Engineering': 'ABE',
  'Metallurgical & Materials Engineering': 'MME',
  'Accountancy': 'ACC',
  'Banking & Finance': 'BFN',
  'Business Administration': 'BUS',
  'Marketing': 'MKT',
  'Public Administration': 'PAD',
  'Economics': 'ECO',
  'Political Science': 'POL',
  'Sociology & Anthropology': 'SOC',
  'Mass Communication': 'MAC',
  'English & Literary Studies': 'ELS',
  'History & International Studies': 'HIS',
  'Philosophy': 'PHL',
  'Psychology': 'PSY',
  'Religious Studies': 'REL',
  'Mathematics': 'MTH',
  'Physics': 'PHY',
  'Chemistry': 'CHM',
  'Biochemistry': 'BCH',
  'Microbiology': 'MCB',
  'Botany': 'BOT',
  'Zoology': 'ZOO',
  'Applied Biology': 'ABG',
  'Geology & Mining': 'GLG',
  'Statistics': 'STA',
  'Industrial Chemistry': 'ICH',
  'Industrial Mathematics': 'IMT',
  'Industrial Physics': 'IPH',
  'Architecture': 'ARC',
  'Building': 'BLD',
  'Estate Management': 'ESM',
  'Fine & Applied Arts': 'FAA',
  'Geography & Meteorology': 'GEO',
  'Quantity Surveying': 'QSV',
  'Surveying & Geoinformatics': 'SVG',
  'Urban & Regional Planning': 'URP',
  'Law': 'LAW',
  'Private & Property Law': 'PPL',
  'Public & International Law': 'PIL',
  'Commercial & Industrial Law': 'CIL',
  'Medicine': 'MED',
  'Surgery': 'SUR',
  'Paediatrics': 'PAE',
  'Obstetrics & Gynaecology': 'OBG',
  'Community Medicine': 'CMD',
  'Anatomy': 'ANA',
  'Medical Biochemistry': 'MBC',
  'Physiology': 'PHS',
  'Pharmaceutical Chemistry': 'PCH',
  'Pharmacognosy': 'PCG',
  'Pharmacology & Toxicology': 'PCT',
  'Pharmaceutics & Pharmaceutical Technology': 'PPT',
  'Clinical Pharmacy & Pharmacy Management': 'CPM',
  'Arts Education': 'AED',
  'Educational Foundations': 'EDF',
  'Science Education': 'SED',
  'Health & Physical Education': 'HPE',
  'Library & Information Science': 'LIS',
  'Guidance & Counselling': 'GCE',
  'Agricultural Economics & Extension': 'AEE',
  'Animal Science': 'ANS',
  'Crop Science': 'CRS',
  'Fisheries & Aquaculture': 'FIA',
  'Food Science & Technology': 'FST',
  'Forestry & Wildlife Management': 'FWM',
  'Soil Science': 'SOS',
  'Medical Laboratory Science': 'MLS',
  'Nursing Science': 'NRS',
  'Public Health': 'PUH',
  'Radiography & Radiological Science': 'RRS',
  'Optometry': 'OPT',
  'Cooperative Economics & Management': 'CEM',
};

// Generate course code from department name
const getCourseCode = (deptName, levelStr, semester, courseNum) => {
  const code = DEPT_CODES[deptName] || deptName.substring(0, 3).toUpperCase();
  const levelDigit = levelStr.substring(0, 1);
  
  // Determine suffix based on semester: 
  // First Semester -> Odd (1, 3, 5...)
  // Second Semester -> Even (2, 4, 6...)
  let suffix;
  if (semester === 'First Semester') {
    suffix = (courseNum * 2) - 1; // 1, 3, 5
  } else {
    suffix = courseNum * 2; // 2, 4, 6
  }
  
  return `${code} ${levelDigit}0${suffix}`;
};

// Book templates for each level
const BOOK_TEMPLATES = [
  // 100 Level Books
  { level: '100 Level', semester: 'First Semester', titlePrefix: 'Introduction to', hasManual: true },
  { level: '100 Level', semester: 'Second Semester', titlePrefix: 'Fundamentals of', hasManual: false },
  
  // 200 Level Books
  { level: '200 Level', semester: 'First Semester', titlePrefix: 'Intermediate', hasManual: true },
  { level: '200 Level', semester: 'Second Semester', titlePrefix: 'Applications of', hasManual: false },

  // 300 Level Books
  { level: '300 Level', semester: 'First Semester', titlePrefix: 'Advanced', hasManual: true },
  { level: '300 Level', semester: 'Second Semester', titlePrefix: 'Research Methods in', hasManual: false },

  // 400 Level Books
  { level: '400 Level', semester: 'First Semester', titlePrefix: 'Special Topics in', hasManual: true },
  { level: '400 Level', semester: 'Second Semester', titlePrefix: 'Project Management for', hasManual: false },
];

const seedBooks = async () => {
  try {
    console.log('📚 Starting book seeding (5 books per department)...\n');

    await connectDatabase();

    // Get all departments with their faculty
    const departments = await prisma.department.findMany({
      include: { faculty: true }
    });

    console.log(`📊 Found ${departments.length} departments. Generating 5 books each...`);

    if (departments.length === 0) {
      console.log('❌ No departments found. Please run seed:departments first.');
      return;
    }

    // Clear existing books
    await prisma.book.deleteMany();
    console.log('🗑️  Cleared existing books.\n');

    let createdCount = 0;

    for (const dept of departments) {
      for (let i = 0; i < BOOK_TEMPLATES.length; i++) {
        const template = BOOK_TEMPLATES[i];
        
        // Use 1 as courseNum since we have one book per semester/level in templates
        // This will generate 101/103 for 1st sem and 102/104 for 2nd sem
        const courseNum = 1;

        await prisma.book.create({
          data: {
            title: `${template.titlePrefix} ${dept.name}`,
            description: `A comprehensive textbook covering ${template.titlePrefix.toLowerCase()} ${dept.name}. Designed for ${template.level} students.`,
            price: 1500 + (i * 500) + Math.floor(Math.random() * 500),
            courseCode: getCourseCode(dept.name, template.level, template.semester, courseNum),
            facultyId: dept.facultyId,
            departmentId: dept.id,
            level: template.level,
            semester: template.semester,
            session: '2024/2025',
            frontCover: PLACEHOLDER_IMAGE,
            backCover: PLACEHOLDER_IMAGE,
            hasManual: template.hasManual,
            manualPrice: template.hasManual ? 800 + Math.floor(Math.random() * 400) : null,
            manualFrontCover: template.hasManual ? PLACEHOLDER_MANUAL : null,
            courseLecturer: getRandomLecturer(),
            quantity: 20 + Math.floor(Math.random() * 80),
          }
        });

        createdCount++;
      }
      process.stdout.write('✅'); // progress indicator
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY:');
    console.log(`   • Books created: ${createdCount}`);
    console.log(`   • Departments processed: ${departments.length}`);
    console.log(`   • Books per department: 5`);
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
