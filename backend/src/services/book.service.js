
import prisma from '../config/database.js';
import { uploadImage, deleteImage, extractPublicId } from '../config/cloudinary.js';
import { deleteFile } from '../utils/upload.util.js';
import { getCache, setCache, deleteCache } from '../config/redis.js';

// Cache keys
const CACHE_KEYS = {
  FILTER_OPTIONS: 'filters:options',
  BOOKS_PREFIX: 'books:',
};

// Cache TTL in seconds
const CACHE_TTL = {
  FILTER_OPTIONS: 600, // 10 minutes
  BOOKS: 300, // 5 minutes
};

/**
 * Invalidate book-related caches
 */
const invalidateBookCaches = async () => {
  await deleteCache(CACHE_KEYS.FILTER_OPTIONS);
  await deleteCache(`${CACHE_KEYS.BOOKS_PREFIX}*`);
};

export const createBook = async (data, files) => {
  try {
    const bookData = {
      title: data.title,
      description: data.description || null,
      price: data.price,
      courseCode: data.courseCode,
      departmentId: data.departmentId && data.departmentId !== '' ? data.departmentId : null,
      facultyId: data.facultyId,
      level: data.level,
      semester: data.semester,
      session: data.session,
      courseLecturer: data.courseLecturer || null,
      // Normalize booleans coming from form data (may be 'true'/'false' strings)
      hasManual: data.hasManual === 'true' || data.hasManual === true || false,
      manualPrice: data.manualPrice ? parseFloat(data.manualPrice) : null,
      quantity: data.quantity ? parseInt(data.quantity) : 0,
    };

    // Validate required files
    if (!files.frontCover || files.frontCover.length === 0) {
      throw new Error('Front cover is required');
    }
    
    // Validate manual cover if hasManual is true
    if (bookData.hasManual && (!files.manualFrontCover || files.manualFrontCover.length === 0)) {
      throw new Error('Manual front cover is required when hasManual is true');
    }

    // Build array of upload promises (only for images that exist)
    const uploadPromises = [];
    const uploadKeys = []; // Track which key each promise corresponds to

    // Front cover (always required)
    uploadPromises.push(uploadImage(files.frontCover[0].path, 'esut-bookshop/books'));
    uploadKeys.push('frontCover');

    // Back cover (optional)
    if (files.backCover && files.backCover.length > 0) {
      uploadPromises.push(uploadImage(files.backCover[0].path, 'esut-bookshop/books'));
      uploadKeys.push('backCover');
    }

    // Manual cover (only if hasManual)
    if (bookData.hasManual && files.manualFrontCover && files.manualFrontCover.length > 0) {
      uploadPromises.push(uploadImage(files.manualFrontCover[0].path, 'esut-bookshop/manuals'));
      uploadKeys.push('manualFrontCover');
    }

    // Upload all images in parallel
    const uploadResults = await Promise.all(uploadPromises);

    // Map results back to bookData
    uploadKeys.forEach((key, index) => {
      bookData[key] = uploadResults[index].url;
    });

    // Create book in database
    const book = await prisma.book.create({
      data: bookData,
      include: {
        faculty: true,
        department: true
      }
    });

    // Clean up temporary files
    if (files.frontCover) deleteFile(files.frontCover[0].path);
    if (files.backCover) deleteFile(files.backCover[0].path);
    if (files.manualFrontCover) deleteFile(files.manualFrontCover[0].path);

    // Invalidate cache
    await invalidateBookCaches();

    return book;
  } catch (error) {
    // Clean up temporary files on error
    if (files.frontCover) deleteFile(files.frontCover[0].path);
    if (files.backCover) deleteFile(files.backCover[0].path);
    if (files.manualFrontCover) deleteFile(files.manualFrontCover[0].path);

    throw error;
  }
};

//Get all books with pagination and filtering
export const getAllBooks = async (query = {}) => {
  const {
    search,
    courseCode,
    departmentId,
    facultyId,
    level,
    semester,
    session,
    hasManual,
    inStock,
    page = 1,
    limit = 30,
  } = query;

  // Build filter conditions
  const where = {};

  if (search) {
    // Normalize search: create variations for course codes (e.g., CSC101 -> CSC 101, CSC 101 -> CSC101)
    const searchTrimmed = search.trim();
    const searchNoSpaces = searchTrimmed.replace(/\s+/g, '');
    // Try to add space between letters and numbers (CSC101 -> CSC 101)
    const searchWithSpace = searchTrimmed.replace(/([A-Za-z]+)(\d+)/g, '$1 $2');
    
    // Build OR conditions for flexible matching
    const searchConditions = [
      { title: { contains: searchTrimmed, mode: 'insensitive' } },
      { courseCode: { contains: searchTrimmed, mode: 'insensitive' } },
    ];
    
    // Add variations if they differ from original
    if (searchNoSpaces !== searchTrimmed) {
      searchConditions.push({ courseCode: { contains: searchNoSpaces, mode: 'insensitive' } });
    }
    if (searchWithSpace !== searchTrimmed && searchWithSpace !== searchNoSpaces) {
      searchConditions.push({ courseCode: { contains: searchWithSpace, mode: 'insensitive' } });
    }
    
    where.OR = searchConditions;
  }

  if (courseCode) where.courseCode = courseCode;
  if (departmentId) where.departmentId = departmentId;
  if (facultyId) where.facultyId = facultyId;
  if (level) where.level = level;
  if (semester) where.semester = semester;
  if (session) where.session = session;
  // normalize string boolean filters
  if (hasManual !== undefined && hasManual !== '') {
    // Accept 'true'|'false' or actual boolean
    where.hasManual = hasManual === 'true' || hasManual === true;
  }
  if (inStock !== undefined && inStock !== '') {
    if (inStock === true || inStock === 'true') {
      where.quantity = { gt: 0 };
    } else {
      where.quantity = { lte: 0 };
    }
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch books and total count
  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        faculty: true,
        department: true
      }
    }),
    prisma.book.count({ where }),
  ]);

  return {
    books,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

//Get book by ID
export const getBookById = async (id) => {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      faculty: true,
      department: true
    }
  });

  if (!book) {
    throw new Error('Book not found');
  }

  return book;
};

//Update book

export const updateBook = async (id, data, files = {}) => {
  const existingBook = await prisma.book.findUnique({
    where: { id },
  });

  if (!existingBook) {
    throw new Error('Book not found');
  }

  try {
    const updateData = { ...data };

    // Convert optional empty string fields to null
    if (updateData.departmentId === '') updateData.departmentId = null;

    // Normalize boolean-like fields
    if (updateData.hasManual !== undefined) {
      updateData.hasManual = updateData.hasManual === 'true' || updateData.hasManual === true;
    }
    
    // Handle manualPrice
    if (updateData.manualPrice) {
      updateData.manualPrice = parseFloat(updateData.manualPrice);
    } else if (updateData.hasManual === false) {
      updateData.manualPrice = null;
    }

    if (updateData.quantity !== undefined) updateData.quantity = parseInt(updateData.quantity);

    // Upload new front cover if provided
    if (files.frontCover && files.frontCover.length > 0) {
      // Delete old image from Cloudinary
      if (existingBook.frontCover) {
        const publicId = extractPublicId(existingBook.frontCover);
        await deleteImage(publicId);
      }

      const frontCoverResult = await uploadImage(files.frontCover[0].path, 'esut-bookshop/books');
      updateData.frontCover = frontCoverResult.url;
    }

    // Upload new back cover if provided
    if (files.backCover && files.backCover.length > 0) {
      // Delete old image from Cloudinary
      if (existingBook.backCover) {
        const publicId = extractPublicId(existingBook.backCover);
        await deleteImage(publicId);
      }

      const backCoverResult = await uploadImage(files.backCover[0].path, 'esut-bookshop/books');
      updateData.backCover = backCoverResult.url;
    }

    // Handle manual cover
    if (files.manualFrontCover && files.manualFrontCover.length > 0) {
      // Delete old manual cover from Cloudinary
      if (existingBook.manualFrontCover) {
        const publicId = extractPublicId(existingBook.manualFrontCover);
        await deleteImage(publicId);
      }

      const manualCoverResult = await uploadImage(files.manualFrontCover[0].path, 'esut-bookshop/manuals');
      updateData.manualFrontCover = manualCoverResult.url;
    }

    // Update book in database
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        faculty: true,
        department: true
      }
    });

    // Clean up temporary files
    if (files.frontCover) deleteFile(files.frontCover[0].path);
    if (files.backCover) deleteFile(files.backCover[0].path);
    if (files.manualFrontCover) deleteFile(files.manualFrontCover[0].path);

    // Invalidate cache
    await invalidateBookCaches();

    return updatedBook;
  } catch (error) {
    // Clean up temporary files on error
    if (files.frontCover) deleteFile(files.frontCover[0].path);
    if (files.backCover) deleteFile(files.backCover[0].path);
    if (files.manualFrontCover) deleteFile(files.manualFrontCover[0].path);

    throw error;
  }
};

//Delete book
export const deleteBook = async (id) => {
  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book) {
    throw new Error('Book not found');
  }

  // Delete images from Cloudinary
  if (book.frontCover) {
    const publicId = extractPublicId(book.frontCover);
    await deleteImage(publicId);
  }

  if (book.backCover) {
    const publicId = extractPublicId(book.backCover);
    await deleteImage(publicId);
  }

  if (book.manualFrontCover) {
    const publicId = extractPublicId(book.manualFrontCover);
    await deleteImage(publicId);
  }

  // Delete book from database
  await prisma.book.delete({
    where: { id },
  });

  // Invalidate cache
  await invalidateBookCaches();
};

//Get unique filter options (for frontend filters)
export const getFilterOptions = async () => {
  // Try to get from cache first
  const cached = await getCache(CACHE_KEYS.FILTER_OPTIONS);
  if (cached) {
    return cached;
  }

  // Cache miss - fetch from database
  const [departments, faculties, levels, semesters, sessions] = await Promise.all([
    prisma.department.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, facultyId: true }
    }),
    prisma.faculty.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    }),
    prisma.book.findMany({
      distinct: ['level'],
      select: { level: true },
    }),
    prisma.book.findMany({
      distinct: ['semester'],
      select: { semester: true },
    }),
    prisma.book.findMany({
      distinct: ['session'],
      select: { session: true },
    }),
  ]);

  const result = {
    departments,
    faculties,
    levels: levels.map((l) => l.level).sort(),
    semesters: semesters.map((s) => s.semester),
    sessions: sessions.map((s) => s.session).sort().reverse(),
  };

  // Store in cache
  await setCache(CACHE_KEYS.FILTER_OPTIONS, result, CACHE_TTL.FILTER_OPTIONS);

  return result;
};