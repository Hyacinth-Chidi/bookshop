/**
 * ============================================
 * PURCHASE CONTROLLER (INACTIVE - FUTURE FEATURE)
 * ============================================
 * Handles purchase operations
 * 
 * NOTE: This controller is built but NOT connected to routes
 * It will be activated when purchase features are needed
 */

import * as purchaseService from '../services/purchase.service.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

/**
 * Initialize purchase
 * @route POST /api/purchases/initialize
 */
export const initializePurchase = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;
    const studentId = req.user.id;

    const result = await purchaseService.initializePurchase(studentId, bookId, quantity);
    return successResponse(res, result, 'Purchase initialized successfully', 201);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('out of stock')) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Verify purchase (Paystack callback)
 * @route GET /api/purchases/verify/:reference
 */
export const verifyPurchase = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const purchase = await purchaseService.verifyPurchase(reference);
    return successResponse(res, purchase, 'Purchase verified successfully');
  } catch (error) {
    if (error.message === 'Purchase not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Get student purchase history
 * @route GET /api/purchases/my-purchases
 */
export const getMyPurchases = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const purchases = await purchaseService.getStudentPurchases(studentId);
    return successResponse(res, purchases, 'Purchase history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all purchases (Admin only)
 * @route GET /api/admin/purchases
 */
export const getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await purchaseService.getAllPurchases();
    return successResponse(res, purchases, 'All purchases retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get purchase statistics (Admin only)
 * @route GET /api/admin/purchases/stats
 */
export const getPurchaseStats = async (req, res, next) => {
  try {
    const stats = await purchaseService.getPurchaseStats();
    return successResponse(res, stats, 'Purchase statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Paystack webhook
 * @route POST /api/purchases/webhook
 */
export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    
    // Verify webhook signature
    const { verifyWebhookSignature } = await import('../config/paystack.js');
    
    if (!verifyWebhookSignature(signature, req.body)) {
      return errorResponse(res, 'Invalid webhook signature', 401);
    }

    // Handle the webhook event
    await purchaseService.handlePaystackWebhook(req.body);
    
    // Always return 200 to Paystack
    return res.status(200).send();
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Paystack from retrying
    return res.status(200).send();
  }
};