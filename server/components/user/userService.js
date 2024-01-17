const bcrypt = require("bcrypt");
const User = require("./userModel");
const mysql = require("mysql2/promise");
const dbConfig = require("../../db/dbConfig");
const UserValidator = require("./userValidator");
const {
  UnauthenticatedError,
  InternalServerError,
  BadRequestError,
} = require("../../errors");

const registerUser = async (firstName, lastName, email, password) => {
  try {
    await UserValidator.validateRegistrationInput(
      firstName,
      lastName,
      email,
      password
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword]
    );

    return { message: "User registered successfully" };
  } catch (error) {
    if (Object.keys(error).length > 0)
      throw new BadRequestError(JSON.stringify(error));

    throw new InternalServerError(
      JSON.stringify({ main: "Internal Server Error." })
    );
  }
};

const authenticateUser = async (email, password) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    const user = rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("Authentication successful");
      return user;
    } else throw new Error(true);
  } catch (error) {
    if (error)
      throw new UnauthenticatedError(
        "Incorrect email or password. Please try again."
      );
    else throw new InternalServerError("Internal Server Error");
  }
};

module.exports = { registerUser, authenticateUser };
