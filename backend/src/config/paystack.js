/**
 * ============================================
 * PAYSTACK CONFIGURATION (INACTIVE - FUTURE USE)
 * ============================================
 * Payment gateway integration for student purchases
 * 
 * NOTE: This is fully implemented and ready to use
 * Activate when purchase features are needed
 */

import https from 'https';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Make request to Paystack API
 * @param {string} path - API endpoint path
 * @param {string} method - HTTP method
 * @param {Object} data - Request body (optional)
 * @returns {Promise<Object>} API response
 */
const paystackRequest = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path,
      method,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          
          if (parsedData.status) {
            resolve(parsedData);
          } else {
            reject(new Error(parsedData.message || 'Paystack request failed'));
          }
        } catch (error) {
          reject(new Error('Failed to parse Paystack response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

/**
 * Initialize Paystack payment
 * @param {Object} paymentData - Payment details
 * @param {string} paymentData.email - Customer email
 * @param {number} paymentData.amount - Amount in kobo (multiply by 100)
 * @param {string} paymentData.reference - Unique transaction reference
 * @param {string} paymentData.callback_url - Callback URL after payment
 * @returns {Promise<Object>} Payment initialization response
 */
export const initializePayment = async ({ email, amount, reference, callback_url }) => {
  try {
    const data = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo (Paystack uses kobo)
      reference,
      callback_url: callback_url || `${process.env.FRONTEND_URL}/payment/verify`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Purchase Reference',
            variable_name: 'purchase_reference',
            value: reference,
          },
        ],
      },
    };

    const response = await paystackRequest('/transaction/initialize', 'POST', data);

    return {
      status: true,
      message: response.message,
      authorization_url: response.data.authorization_url,
      access_code: response.data.access_code,
      reference: response.data.reference,
    };
  } catch (error) {
    throw new Error(`Payment initialization failed: ${error.message}`);
  }
};

/**
 * Verify Paystack payment
 * @param {string} reference - Transaction reference
 * @returns {Promise<Object>} Verification response
 */
export const verifyPayment = async (reference) => {
  try {
    const response = await paystackRequest(`/transaction/verify/${reference}`);

    return {
      status: response.data.status === 'success',
      message: response.message,
      amount: response.data.amount / 100, // Convert back from kobo
      reference: response.data.reference,
      paid_at: response.data.paid_at,
      customer: {
        email: response.data.customer.email,
        customer_code: response.data.customer.customer_code,
      },
      metadata: response.data.metadata,
    };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

/**
 * Get transaction details
 * @param {string} reference - Transaction reference
 * @returns {Promise<Object>} Transaction details
 */
export const getTransaction = async (reference) => {
  try {
    const response = await paystackRequest(`/transaction/${reference}`);

    return {
      status: response.data.status,
      amount: response.data.amount / 100,
      reference: response.data.reference,
      message: response.data.gateway_response,
      paid_at: response.data.paid_at,
      customer: response.data.customer,
    };
  } catch (error) {
    throw new Error(`Failed to get transaction: ${error.message}`);
  }
};

/**
 * Generate unique transaction reference
 * @param {string} prefix - Reference prefix (e.g., 'ESUT')
 * @returns {string} Unique reference
 */
export const generateReference = (prefix = 'ESUT') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Webhook signature verification
 * @param {string} signature - Paystack signature from webhook
 * @param {Object} payload - Webhook payload
 * @returns {boolean} Verification result
 */
export const verifyWebhookSignature = (signature, payload) => {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
};

export default {
  initializePayment,
  verifyPayment,
  getTransaction,
  generateReference,
  verifyWebhookSignature,
};