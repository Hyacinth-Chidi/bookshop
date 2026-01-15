import express from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';
import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

const router = express.Router();

// Get System Settings
router.get('/', authenticate, async (req, res) => {
    try {
        let settings = await prisma.systemSettings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    currentSession: '2024/2025',
                    currentSemester: 'First Semester'
                }
            });
        }

        return successResponse(res, settings, 'System settings retrieved', 200);
    } catch (error) {
        return errorResponse(res, 'Error retrieving settings', 500, error.message);
    }
});

// Update System Settings (Admin Only)
router.put('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { currentSession, currentSemester } = req.body;

        let settings = await prisma.systemSettings.findFirst();

        if (settings) {
            settings = await prisma.systemSettings.update({
                where: { id: settings.id },
                data: {
                    currentSession,
                    currentSemester
                }
            });
        } else {
            settings = await prisma.systemSettings.create({
                data: {
                    currentSession,
                    currentSemester
                }
            });
        }

        return successResponse(res, settings, 'System settings updated', 200);
    } catch (error) {
        return errorResponse(res, 'Error updating settings', 500, error.message);
    }
});

export default router;
