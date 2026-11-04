const jwt = require("jsonwebtoken");
const secretKey=process.env.JWT_SECRET;
class TokenService {

  generateToken(payload) {

    return jwt.sign(
      payload,
      secretKey,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );
  }

}

module.exports = new TokenService();
