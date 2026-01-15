/**
 * ============================================
 * PURCHASE ROUTES (INACTIVE - FUTURE FEATURE)
 * ============================================
 * 
 * NOTE: These routes are built but NOT connected to the main router
 * They will be activated when purchase features are needed
 */

import express from 'express';
import * as purchaseController from '../controllers/purchase.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/purchases/initialize
 * @desc    Initialize purchase
 * @access  Private (Student)
 */
router.post('/initialize', authenticate, purchaseController.initializePurchase);

/**
 * @route   GET /api/purchases/verify/:reference
 * @desc    Verify purchase (Paystack callback)
 * @access  Public
 */
router.get('/verify/:reference', purchaseController.verifyPurchase);

/**
 * @route   POST /api/purchases/webhook
 * @desc    Paystack webhook for real-time payment updates
 * @access  Public (Paystack only)
 */
router.post('/webhook', purchaseController.handleWebhook);

/**
 * @route   GET /api/purchases/my-purchases
 * @desc    Get student purchase history
 * @access  Private (Student)
 */
router.get('/my-purchases', authenticate, purchaseController.getMyPurchases);

/**
 * @route   GET /api/purchases
 * @desc    Get all purchases
 * @access  Private (Admin)
 */
router.get('/', authenticate, isAdmin, purchaseController.getAllPurchases);

/**
 * @route   GET /api/purchases/stats
 * @desc    Get purchase statistics
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, isAdmin, purchaseController.getPurchaseStats);

export default router;