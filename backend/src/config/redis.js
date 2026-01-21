/**
 * ============================================
 * REDIS CACHE CONFIGURATION
 * ============================================
 * Provides caching utilities for frequently accessed data
 */

import Redis from 'ioredis';
import logger from '../utils/logger.util.js';

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
});

// Connection event handlers
redis.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  logger.error(`❌ Redis connection error: ${err.message}`);
});

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed value or null
 */
export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache GET error for key ${key}: ${error.message}`);
    return null;
  }
};

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON stringified)
 * @param {number} ttlSeconds - Time to live in seconds (default 600 = 10 min)
 * @returns {Promise<boolean>} - Success status
 */
export const setCache = async (key, value, ttlSeconds = 600) => {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Cache SET error for key ${key}: ${error.message}`);
    return false;
  }
};

/**
 * Delete value from cache
 * @param {string} key - Cache key (supports wildcards with *)
 * @returns {Promise<boolean>} - Success status
 */
export const deleteCache = async (key) => {
  try {
    if (key.includes('*')) {
      // Handle wildcard deletion
      const keys = await redis.keys(key);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } else {
      await redis.del(key);
    }
    return true;
  } catch (error) {
    logger.error(`Cache DELETE error for key ${key}: ${error.message}`);
    return false;
  }
};

/**
 * Clear all cache (use with caution)
 * @returns {Promise<boolean>} - Success status
 */
export const clearAllCache = async () => {
  try {
    await redis.flushdb();
    logger.info('🗑️ Redis cache cleared');
    return true;
  } catch (error) {
    logger.error(`Cache CLEAR error: ${error.message}`);
    return false;
  }
};

export default redis;
