// Email service for OTP and password reset
// For development, this logs to console. In production, use Nodemailer or SendGrid

class EmailService {
  constructor() {
    this.useRealEmail = process.env.EMAIL_SERVICE === 'true';
    this.emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID || 'template_29vfpij';
    this.emailjsServiceId = process.env.EMAILJS_SERVICE_ID || '';
    this.emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY || '';
  }

  // Send OTP email
  async sendOTP(email, otp, name) {
    const subject = 'Netsoko - Email Verification Code';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #00C853;">Welcome to Netsoko!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Netsoko. Please use the following OTP to verify your email address:</p>
        <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Netsoko Team</p>
      </div>
    `;

    if (this.useRealEmail) {
      return this.sendRealEmail(email, subject, html, {
        templateId: this.emailjsTemplateId,
        type: 'otp',
        otp,
        name,
      });
    } else {
      // Development mode - log to console
      console.log('='.repeat(50));
      console.log('EMAIL SERVICE - DEVELOPMENT MODE');
      console.log('='.repeat(50));
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log('='.repeat(50));
      console.log('HTML Content:');
      console.log(html);
      console.log('='.repeat(50));
      console.log(`OTP: ${otp}`);
      console.log('='.repeat(50));
      return true;
    }
  }

  // Send password reset email
  async sendPasswordReset(email, resetLink, name) {
    const subject = 'Netsoko - Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #00C853;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password for your Netsoko account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background: #00C853; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #00C853;">${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Netsoko Team</p>
      </div>
    `;

    try {
      if (this.useRealEmail) {
        const sent = await this.sendRealEmail(email, subject, html, {
          templateId: this.emailjsTemplateId,
          type: 'password-reset',
          resetLink,
          name,
        });

        if (!sent) {
          console.warn('Password reset email send failed, falling back to console link output.');
        }

        return sent;
      }

      console.log('='.repeat(50));
      console.log('EMAIL SERVICE - DEVELOPMENT MODE');
      console.log('='.repeat(50));
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log('='.repeat(50));
      console.log(`Reset Link: ${resetLink}`);
      console.log('='.repeat(50));
      return true;
    } catch (error) {
      console.error('Password reset email failed:', error.message);
      console.log(`Reset Link: ${resetLink}`);
      return false;
    }
  }

  // Real email sending (for production)
  async sendRealEmail(email, subject, html, metadata = {}) {
    const nodemailer = require('nodemailer');

    try {
      if (this.emailjsServiceId && this.emailjsPublicKey) {
        const emailjs = require('@emailjs/nodejs');
        await emailjs.send(this.emailjsServiceId, metadata.templateId || this.emailjsTemplateId, {
          to_email: email,
          subject,
          message: html,
          name: metadata.name || 'Netsoko User',
          otp: metadata.otp || '',
          reset_link: metadata.resetLink || '',
        }, {
          publicKey: this.emailjsPublicKey,
        });
        console.log(`EmailJS email sent successfully to ${email}`);
        return true;
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@netsoko.com',
        to: email,
        subject: subject,
        html: html
      });
      
      console.log(`Email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error.message);
      // Fallback to console logging if email fails
      console.log('='.repeat(50));
      console.log('EMAIL SERVICE - FALLBACK MODE');
      console.log('='.repeat(50));
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log('='.repeat(50));
      console.log(html);
      console.log('='.repeat(50));
      return false;
    }
  }
}

module.exports = new EmailService();