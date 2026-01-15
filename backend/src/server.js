/**
 * ============================================
 * SERVER ENTRY POINT
 * ============================================
 */

import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import logger from './utils/logger.util.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║        🎓 ESUT BOOKSHOP API - SERVER RUNNING          ║
║                                                        ║
║        Environment: ${process.env.NODE_ENV || 'development'}                        ║
║        Port: ${PORT}                                     ║
║        URL: http://localhost:${PORT}                     ║
║                                                        ║
║        📚 Ready to serve students!                     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is already in use`);
      } else {
        logger.error(`❌ Server error: ${error.message}`);
      }
      process.exit(1);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('✅ HTTP server closed');
        await disconnectDatabase();
        logger.info('👋 Server shut down successfully');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️  Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`💥 UNCAUGHT EXCEPTION: ${error.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`💥 UNHANDLED REJECTION: ${reason}`);
  process.exit(1);
});

// Start the server
startServer();