const userService = require("../components/user/userService");

async function authenticateUser(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await userService.authenticateUser(username, password);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

module.exports = authenticateUser;
