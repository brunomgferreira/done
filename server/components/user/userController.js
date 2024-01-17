const { registerUser, authenticateUser } = require("./userService");

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const result = await registerUser(firstName, lastName, email, password);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      msg: "Registration failed",
      errors: JSON.parse(error.message),
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    res.json({ user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = { register, login };
