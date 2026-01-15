/**
 * ============================================
 * STUDENT SERVICE (INACTIVE - FUTURE FEATURE)
 * ============================================
 * Business logic for student operations
 * 
 * NOTE: This service is built but NOT connected to routes
 * It will be activated when student features are needed
 */

import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';

/**
 * Register a new student
 * @param {Object} data - Student data
 * @returns {Promise<Object>} Created student
 */
export const registerStudent = async (data) => {
  const { email, regNo, password, level } = data;

  // Check if email or regNo already exists
  const existingStudent = await prisma.student.findFirst({
    where: {
      OR: [{ email }, { regNo }],
    },
  });

  if (existingStudent) {
    if (existingStudent.email === email) {
      throw new Error('Email already registered');
    }
    if (existingStudent.regNo === regNo) {
      throw new Error('Registration number already exists');
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create student
  const student = await prisma.student.create({
    data: {
      email,
      regNo,
      password: hashedPassword,
      level,
    },
    select: {
      id: true,
      email: true,
      regNo: true,
      level: true,
      createdAt: true,
    },
  });

  return student;
};

/**
 * Student login
 * @param {string} email - Student email
 * @param {string} password - Student password
 * @returns {Promise<Object>} Student data
 */
export const loginStudent = async (email, password) => {
  const student = await prisma.student.findUnique({
    where: { email },
  });

  if (!student) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, student.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Return student without password
  const { password: _, ...studentData } = student;
  return studentData;
};

/**
 * Get student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Student data
 */
export const getStudentById = async (id) => {
  const student = await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      regNo: true,
      level: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  return student;
};

/**
 * Get all students (for admin)
 * @returns {Promise<Array>} List of students
 */
export const getAllStudents = async () => {
  return await prisma.student.findMany({
    select: {
      id: true,
      email: true,
      regNo: true,
      level: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};