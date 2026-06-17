// Email service for OTP and password reset
// Enhanced with proper error handling, logging, and delivery tracking

class EmailService {
  constructor() {
    this.useRealEmail = process.env.EMAIL_SERVICE === 'true';
    this.transporter = null;
    this.emailLog = [];
    this.maxLogSize = 100;
  }

  // Initialize email transporter
  initializeTransporter() {
    if (!this.useRealEmail) return;

    const nodemailer = require('nodemailer');
    
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email transporter verification failed:', error.message);
        } else {
          console.log('✅ Email transporter is ready');
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error.message);
    }
  }

  // Log email activity
  logEmailActivity(type, email, status, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      email,
      status,
      details
    };

    this.emailLog.push(logEntry);

    // Keep log size manageable
    if (this.emailLog.length > this.maxLogSize) {
      this.emailLog.shift();
    }

    console.log(`📧 Email Log [${type}]: ${email} - ${status}`);
    if (Object.keys(details).length > 0) {
      console.log(`   Details:`, details);
    }
  }

  // Get email log
  getEmailLog() {
    return this.emailLog;
  }

  // Send OTP email with enhanced tracking
  async sendOTP(email, otp, name, purpose = 'email verification') {
    const subject = purpose === 'account deletion' 
      ? 'Netsoko - Account Deletion Verification Code'
      : 'Netsoko - Email Verification Code';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #00C853; margin: 0 0 20px 0;">${purpose === 'account deletion' ? 'Account Deletion' : 'Welcome to Netsoko!'}</h2>
          <p style="margin: 0 0 10px 0;">Hi ${name},</p>
          <p style="margin: 0 0 20px 0;">
            ${purpose === 'account deletion' 
              ? 'You requested to delete your Netsoko account. Please use the following verification code to confirm this action:'
              : 'Thank you for registering with Netsoko. Please use the following OTP to verify your email address:'}
          </p>
          <div style="background: linear-gradient(135deg, #00C853 0%, #00A843 100%); padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 25px 0; color: white; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="margin: 0 0 10px 0; color: #666;">This code will expire in 10 minutes.</p>
          <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          <p style="margin: 0; color: #999; font-size: 12px;">Best regards,<br>The Netsoko Team</p>
        </div>
      </div>
    `;

    const startTime = Date.now();

    if (this.useRealEmail) {
      try {
        if (!this.transporter) {
          this.initializeTransporter();
        }

        const result = await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@netsoko.com',
          to: email,
          subject: subject,
          html: html
        });

        const deliveryTime = Date.now() - startTime;
        
        this.logEmailActivity('OTP', email, 'success', {
          purpose,
          deliveryTime: `${deliveryTime}ms`,
          messageId: result.messageId
        });

        console.log(`✅ OTP email sent successfully to ${email} in ${deliveryTime}ms`);
        return { success: true, deliveryTime };
      } catch (error) {
        const deliveryTime = Date.now() - startTime;
        
        this.logEmailActivity('OTP', email, 'failed', {
          purpose,
          error: error.message,
          deliveryTime: `${deliveryTime}ms`
        });

        console.error(`❌ OTP email sending failed to ${email}:`, error.message);
        
        // Fallback to console logging
        this.logToConsole(email, subject, html, otp);
        return { success: false, error: error.message };
      }
    } else {
      // Development mode - log to console
      this.logToConsole(email, subject, html, otp);
      this.logEmailActivity('OTP', email, 'dev-mode', { purpose });
      return { success: true, mode: 'development' };
    }
  }

  // Send password reset email
  async sendPasswordReset(email, resetLink, name) {
    const subject = 'Netsoko - Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #00C853; margin: 0 0 20px 0;">Password Reset Request</h2>
          <p style="margin: 0 0 10px 0;">Hi ${name},</p>
          <p style="margin: 0 0 20px 0;">We received a request to reset your password for your Netsoko account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #00C853 0%, #00A843 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="margin: 0 0 10px 0; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="margin: 0 0 20px 0; word-break: break-all; color: #00C853; font-size: 14px;">${resetLink}</p>
          <p style="margin: 0 0 10px 0; color: #666;">This link will expire in 1 hour.</p>
          <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          <p style="margin: 0; color: #999; font-size: 12px;">Best regards,<br>The Netsoko Team</p>
        </div>
      </div>
    `;

    const startTime = Date.now();

    if (this.useRealEmail) {
      try {
        if (!this.transporter) {
          this.initializeTransporter();
        }

        const result = await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@netsoko.com',
          to: email,
          subject: subject,
          html: html
        });

        const deliveryTime = Date.now() - startTime;
        
        this.logEmailActivity('Password Reset', email, 'success', {
          deliveryTime: `${deliveryTime}ms`,
          messageId: result.messageId
        });

        console.log(`✅ Password reset email sent successfully to ${email} in ${deliveryTime}ms`);
        return { success: true, deliveryTime };
      } catch (error) {
        const deliveryTime = Date.now() - startTime;
        
        this.logEmailActivity('Password Reset', email, 'failed', {
          error: error.message,
          deliveryTime: `${deliveryTime}ms`
        });

        console.error(`❌ Password reset email sending failed to ${email}:`, error.message);
        this.logToConsole(email, subject, html, resetLink);
        return { success: false, error: error.message };
      }
    } else {
      // Development mode - log to console
      this.logToConsole(email, subject, html, resetLink);
      this.logEmailActivity('Password Reset', email, 'dev-mode');
      return { success: true, mode: 'development' };
    }
  }

  // Console logging fallback
  logToConsole(email, subject, html, sensitiveData) {
    console.log('='.repeat(60));
    console.log('📧 EMAIL SERVICE - DEVELOPMENT/FALLBACK MODE');
    console.log('='.repeat(60));
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log('='.repeat(60));
    console.log('HTML Content:');
    console.log(html);
    console.log('='.repeat(60));
    console.log(`Sensitive Data: ${sensitiveData}`);
    console.log('='.repeat(60));
  }
}

// Initialize singleton instance
const emailService = new EmailService();
emailService.initializeTransporter();

module.exports = emailService;