const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const tokenService = require("../jwt/token.service");

class AuthService {

  // SIGNUP
  async userSignup({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    if (password.length < 8) {
      throw new Error("Password must contain at least 8 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer"
    });

    const user = savedUser.toObject();
    delete user.password;
    return user;
  }

  // LOGIN
  async userLogin({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user || !user.isActive) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = tokenService.generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role          // was hard-coded "customer" before
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return { user: safeUser, token };
  }
}

module.exports = new AuthService();