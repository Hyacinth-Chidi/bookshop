import 'dotenv/config';
import prisma, { connectDatabase, disconnectDatabase } from '../config/database.js';

const deleteBooks = async () => {
  try {
    console.log('🗑️  Starting book deletion...');

    await connectDatabase();

    // Delete all books
    const result = await prisma.book.deleteMany();
    
    console.log(`✅ Successfully deleted ${result.count} books.`);

  } catch (error) {
    console.error('❌ Error deleting books:', error.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

deleteBooks();
