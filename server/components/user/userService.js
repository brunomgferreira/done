const bcrypt = require("bcrypt");
const pool = require("../../db/dbConnect");
const UserValidator = require("./userValidator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  UnauthenticatedError,
  InternalServerError,
  BadRequestError,
} = require("../../errors");

const registerUser = async (firstName, lastName, email, password) => {
  let connection;
  try {
    await UserValidator.validateRegistrationInput(
      firstName,
      lastName,
      email,
      password
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword]
    );

    connection.release();

    return { message: "User registered successfully" };
  } catch (error) {
    if (Object.keys(error).length > 0)
      throw new BadRequestError(JSON.stringify(error));

    throw new InternalServerError(
      JSON.stringify({ main: "Internal Server Error." })
    );
  } finally {
    if (connection) connection.release();
  }
};

const authenticateUser = async (email, password) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    const user = rows[0];

    connection.release();
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id, firstName: user.firstName, lastName: user.lastName },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );
      return {
        user: { firstName: user.firstName, lastName: user.lastName },
        token,
      };
    } else throw new Error(true);
  } catch (error) {
    if (error)
      throw new UnauthenticatedError(
        "Incorrect email or password. Please try again."
      );
    else throw new InternalServerError("Internal Server Error");
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { registerUser, authenticateUser };
