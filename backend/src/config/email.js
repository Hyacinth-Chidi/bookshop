

import { Resend } from 'resend';
import logger from '../utils/logger.util.js';

// Lazy initialization to handle missing API key gracefully
let resend = null;
const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      logger.warn('RESEND_API_KEY not configured - email features disabled');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

/**
 * Send email via Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise<Object>}
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const client = getResendClient();
    if (!client) {
      logger.warn('Email not sent - Resend not configured');
      return { success: false, message: 'Email service not configured' };
    }
    
    const result = await client.emails.send({
      from: 'ESUT Bookshop <noreply@esutbookshop.com>',
      to,
      subject,
      html,
    });

    return result;
  } catch (error) {
    logger.error('Email sending failed:', error.message);
    throw new Error('Failed to send email');
  }
};

/**
 * Send welcome email to new sub-admin
 * @param {string} email - Sub-admin email
 * @param {string} username - Sub-admin username
 * @param {string} temporaryPassword - Temporary password
 * @returns {Promise<void>}
 */
export const sendSubAdminWelcomeEmail = async (email, username, temporaryPassword) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .credentials { background-color: #fff; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ESUT Bookshop Admin Panel</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have been added as a Sub-Admin for the ESUT Bookshop management system.</p>
            <div class="credentials">
              <h3>Your Login Credentials:</h3>
              <p><strong>Username:</strong> ${username}</p>
              <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
            </div>
            <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            <p>You can now manage books in the system.</p>
          </div>
          <div class="footer">
            <p>© 2024 ESUT Bookshop. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to ESUT Bookshop Admin Panel',
    html,
  });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} username - Username or Reg No
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email, username, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF6B6B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #4CAF50; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px;
            margin: 20px 0;
          }
          .warning { 
            background-color: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 15px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${username}</strong>,</p>
            <p>We received a request to reset your password for your ESUT Bookshop account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <div class="warning">
              <p><strong>⚠️ Important:</strong></p>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 ESUT Bookshop. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password - ESUT Bookshop',
    html,
  });
};

/**
 * Send password reset success email
 * @param {string} email - User email
 * @param {string} username - Username or Reg No
 * @returns {Promise<void>}
 */
export const sendPasswordResetSuccessEmail = async (email, username) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .success { 
            background-color: #d4edda; 
            border-left: 4px solid #28a745; 
            padding: 15px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Password Reset Successful</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${username}</strong>,</p>
            <div class="success">
              <p><strong>Your password has been successfully reset!</strong></p>
            </div>
            <p>You can now log in to your ESUT Bookshop account with your new password.</p>
            <p>If you did not make this change, please contact support immediately.</p>
          </div>
          <div class="footer">
            <p>© 2024 ESUT Bookshop. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Successful - ESUT Bookshop',
    html,
  });
};

export default getResendClient;