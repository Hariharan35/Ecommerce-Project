const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const { getPasswordResetTemplate } = require("./templates/passwordReset.template");

const fail = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

class EmailService {
  constructor() {
    this.emailUser = process.env.USER_EMAIL;
    this.emailPass = process.env.EMAIL_PASSWORD;

    if (!this.emailUser || !this.emailPass) {
      console.warn("USER_EMAIL / EMAIL_PASSWORD missing in .env, emails will fail");
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: this.emailUser, pass: this.emailPass },
    });
  }

  generateOtp() {
    return crypto.randomInt(1000, 10000).toString();
  }

  async sendMail({ to, subject, html, text }) {
    return this.transporter.sendMail({
      from: `"MyShop" <${this.emailUser}>`,
      to,
      subject,
      text,
      html,
    });
  }

  async requestPasswordReset(email) {
    if (!email) throw fail("Email is required");

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, isActive: true });

    // Same response whether or not the user exists (prevents email discovery)
    const response = {
      success: true,
      message: "If this email is registered, an OTP has been sent.",
    };
    if (!user) return response;

    // Old OTPs become Used:true (your whiteboard flow)
    await Otp.updateMany(
      { email: normalizedEmail, Used: false },
      { $set: { Used: true } }
    );

    const otp = this.generateOtp();
    await Otp.create({
      email: normalizedEmail,
      OTP: otp,
      Used: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const template = getPasswordResetTemplate({ otp, name: user.name });

    await this.sendMail({
      to: normalizedEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return response;
  }

  async resetPassword({ email, otp, newPassword }) {
    if (!email) throw fail("Email is required");
    if (!otp) throw fail("OTP is required");
    if (!newPassword) throw fail("New password is required");
    if (newPassword.length < 8) {
      throw fail("Password must be at least 8 characters long");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Only the latest OTP for this email counts
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      Used: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.OTP !== otp.toString().trim()) {
      throw fail("Invalid or already used OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
      otpRecord.Used = true;
      await otpRecord.save();
      throw fail("OTP has expired. Please request a new one.");
    }

    const user = await User.findOne({ email: normalizedEmail, isActive: true });
    if (!user) throw fail("Invalid or already used OTP");

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    otpRecord.Used = true;
    await otpRecord.save();

    return { success: true, message: "Password has been reset successfully." };
  }
}

module.exports = new EmailService();