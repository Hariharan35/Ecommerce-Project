const authService = require("../services/auth.service");
const emailService = require("../email/email.service");

class AuthController {

  // POST /api/auth/signup
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: '"name", "email" and "password" are required'
        });
      }

      const newUser = await authService.userSignup({ name, email, password });

      return res.status(201).json({
        message: "Account created successfully",
        user: newUser
      });

    } catch (err) {
      if (err.code === 11000 || err.message === "Email already registered") {
        return res.status(409).json({
          message: "A user with this email already exists"
        });
      }
      return res.status(400).json({ error: err.message });
    }
  }

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: '"email" and "password" are required'
        });
      }

      const result = await authService.userLogin({ email, password });

      return res.status(200).json({
        message: "Login successful",
        user: result.user,
        token: result.token
      });

    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req, res) {
    try {
      const result = await emailService.requestPasswordReset(req.body.email);
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req, res) {
    try {
      const result = await emailService.resetPassword(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();