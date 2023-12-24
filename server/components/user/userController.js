const userService = require("./userService");

class UserController {
  async register(req, res) {
    const { firstName, lastName, email, password } = req.body;

    try {
      const result = await userService.registerUser(
        firstName,
        lastName,
        email,
        password
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({
        msg: "Registration failed",
        errors: JSON.parse(error.message),
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userService.authenticateUser(email, password);
      res.json({ user });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
