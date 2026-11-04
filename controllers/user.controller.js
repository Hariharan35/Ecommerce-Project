const userService = require("../services/user.service");

class UserController {

  // GET /api/users/getuserprofile
  async getUserProfile(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Profile fetched successfully",
        user
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();