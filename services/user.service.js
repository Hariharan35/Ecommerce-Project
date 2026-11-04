const User = require("../models/user.model");

class UserService {

  // GET USER PROFILE
  async getUserById(id) {
    return User.findOne({
      _id: id,
      isActive: true
    }).select("-password");
  }
}

module.exports = new UserService();