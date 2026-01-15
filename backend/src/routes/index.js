import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import bookRoutes from './book.routes.js';
import settingsRoutes from './settings.routes.js';
import facultyRoutes from './faculty.routes.js';

// INACTIVE ROUTES - Import but don't use until needed
// import studentRoutes from './student.routes.js';
// import purchaseRoutes from './purchase.routes.js';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ESUT Bookshop API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * ACTIVE ROUTES
 */
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/books', bookRoutes);
router.use('/settings', settingsRoutes);
router.use('/faculties', facultyRoutes);

/**
 * INACTIVE ROUTES - Uncomment when features are ready to activate
 * 
 * To activate student features:
 * 1. Uncomment the import at the top
 * 2. Uncomment the line below
 */
// router.use('/students', studentRoutes);

/**
 * To activate purchase features:
 * 1. Uncomment the import at the top
 * 2. Uncomment the line below
 */
// router.use('/purchases', purchaseRoutes);

export default router;