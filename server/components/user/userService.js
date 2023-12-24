const bcrypt = require("bcrypt");
const User = require("./userModel");
const mysql = require("mysql2/promise");
const dbConfig = require("../../db/dbConfig");
const UserValidator = require("./userValidator");

class UserService {
  async registerUser(firstName, lastName, email, password) {
    try {
      UserValidator.validateRegistrationInput(
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
      console.log(error);
      if (Object.keys(error).length > 0) throw new Error(JSON.stringify(error));

      if (error.code === "ER_DUP_ENTRY")
        throw new Error(
          JSON.stringify({
            email: "Email is already in use. Please use a different email.",
          })
        );
      else throw new Error(JSON.stringify({ main: "Internal Server Error." }));
    }
  }

  async authenticateUser(email, password) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute(
        "SELECT * FROM user WHERE email = ?",
        [email]
      );
      const user = rows[0];

      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          console.log("Authentication successful");
          return user;
        } else {
          throw new Error("Authentication failed");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
}

module.exports = new UserService();
