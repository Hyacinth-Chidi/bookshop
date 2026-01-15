/**
 * ============================================
 * FACULTY SERVICE
 * ============================================
 * Business logic for faculty and department operations
 */

import prisma from '../config/database.js';

/**
 * Get all faculties with their departments
 * @returns {Promise<Array>} List of faculties
 */
export const getAllFaculties = async () => {
    return await prisma.faculty.findMany({
        include: {
            departments: {
                orderBy: { name: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    });
};

/**
 * Create a new faculty
 * @param {string} name - Faculty name
 * @returns {Promise<Object>} Created faculty
 */
export const createFaculty = async (name) => {
    const existing = await prisma.faculty.findUnique({
        where: { name }
    });

    if (existing) {
        throw new Error('Faculty already exists');
    }

    return await prisma.faculty.create({
        data: { name }
    });
};

/**
 * Delete a faculty
 * @param {string} id - Faculty ID
 * @returns {Promise<Object>} Deleted faculty
 */
export const deleteFaculty = async (id) => {
    return await prisma.faculty.delete({
        where: { id }
    });
};

/**
 * Create a new department
 * @param {string} name - Department name
 * @param {string} facultyId - Faculty ID
 * @returns {Promise<Object>} Created department
 */
export const createDepartment = async (name, facultyId) => {
    // Check if department exists in this faculty
    const existing = await prisma.department.findFirst({
        where: {
            name,
            facultyId
        }
    });

    if (existing) {
        throw new Error('Department already exists in this faculty');
    }

    return await prisma.department.create({
        data: {
            name,
            facultyId
        }
    });
};

/**
 * Delete a department
 * @param {string} id - Department ID
 * @returns {Promise<Object>} Deleted department
 */
export const deleteDepartment = async (id) => {
    return await prisma.department.delete({
        where: { id }
    });
};
