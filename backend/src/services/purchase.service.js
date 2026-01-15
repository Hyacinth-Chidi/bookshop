/**
 * ============================================
 * PURCHASE SERVICE (INACTIVE - FUTURE FEATURE)
 * ============================================
 * Business logic for purchase operations with Paystack
 * 
 * NOTE: This service is built but NOT connected to routes
 * It will be activated when purchase features are needed
 */

import prisma from '../config/database.js';

/**
 * Initialize purchase transaction
 * @param {string} studentId - Student ID
 * @param {string} bookId - Book ID
 * @param {number} quantity - Quantity
 * @returns {Promise<Object>} Purchase data with Paystack reference
 */
export const initializePurchase = async (studentId, bookId, quantity = 1) => {
  // Verify student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Verify book exists and is in stock
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new Error('Book not found');
  }

  if (!book.inStock) {
    throw new Error('Book is currently out of stock');
  }

  // Calculate total amount (book only, not manual)
  const totalAmount = book.price * quantity;

  // Create purchase record
  const purchase = await prisma.purchase.create({
    data: {
      studentId,
      bookId,
      quantity,
      totalAmount,
      paymentStatus: 'pending',
    },
    include: {
      book: {
        select: {
          name: true,
          price: true,
          courseCode: true,
        },
      },
      student: {
        select: {
          email: true,
          regNo: true,
        },
      },
    },
  });

  // TODO: Initialize Paystack payment here
  // const paystackResponse = await initializePaystackPayment({
  //   email: student.email,
  //   amount: totalAmount * 100, // Paystack expects amount in kobo
  //   reference: purchase.id,
  // });

  return {
    purchase,
    // paymentUrl: paystackResponse.authorization_url,
    // paystackRef: paystackResponse.reference,
  };
};

/**
 * Verify and complete purchase
 * @param {string} reference - Paystack reference
 * @returns {Promise<Object>} Updated purchase
 */
export const verifyPurchase = async (reference) => {
  // TODO: Verify payment with Paystack
  // const paystackVerification = await verifyPaystackPayment(reference);

  const purchase = await prisma.purchase.findFirst({
    where: { paystackRef: reference },
  });

  if (!purchase) {
    throw new Error('Purchase not found');
  }

  // Update purchase status
  const updatedPurchase = await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      paymentStatus: 'completed', // or 'failed' based on Paystack response
    },
    include: {
      book: true,
      student: {
        select: {
          id: true,
          email: true,
          regNo: true,
          level: true,
        },
      },
    },
  });

  return updatedPurchase;
};

/**
 * Get student purchase history
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} List of purchases
 */
export const getStudentPurchases = async (studentId) => {
  return await prisma.purchase.findMany({
    where: { studentId },
    include: {
      book: {
        select: {
          name: true,
          courseCode: true,
          frontCover: true,
        },
      },
    },
    orderBy: {
      purchasedAt: 'desc',
    },
  });
};

/**
 * Get all purchases (for admin dashboard)
 * @returns {Promise<Array>} List of all purchases
 */
export const getAllPurchases = async () => {
  return await prisma.purchase.findMany({
    include: {
      book: {
        select: {
          name: true,
          courseCode: true,
          price: true,
        },
      },
      student: {
        select: {
          email: true,
          regNo: true,
          level: true,
        },
      },
    },
    orderBy: {
      purchasedAt: 'desc',
    },
  });
};

/**
 * Get purchase statistics
 * @returns {Promise<Object>} Purchase statistics
 */
export const getPurchaseStats = async () => {
  const [totalPurchases, completedPurchases, pendingPurchases, totalRevenue] = await Promise.all([
    prisma.purchase.count(),
    prisma.purchase.count({ where: { paymentStatus: 'completed' } }),
    prisma.purchase.count({ where: { paymentStatus: 'pending' } }),
    prisma.purchase.aggregate({
      where: { paymentStatus: 'completed' },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    totalPurchases,
    completedPurchases,
    pendingPurchases,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
  };
};