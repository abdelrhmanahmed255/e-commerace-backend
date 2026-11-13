import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
        return true;
      }

      await this.transporter.sendMail({
        from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.log('Failed to send email:', error.message);
      return false;
    }
  }

  async sendOtpEmail(to: string, otp: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Verify Your Account</h2>
        <p>Use the following OTP code to complete your verification:</p>
        <h1 style="color: #2b6cb0; letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `;
    return this.sendEmail(to, 'Account Verification OTP', html);
  }
}
