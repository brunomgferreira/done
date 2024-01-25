const mysql = require("mysql2/promise");
const dbConfig = require("../db/dbConfig");

const isUniqueValidator = async (value, table, column) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.query(
      `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ?`,
      [value]
    );

    const count = rows[0].count;

    if (count === 0) {
      return undefined;
    } else {
      const fieldName = column.charAt(0).toUpperCase() + column.slice(1);
      return `${fieldName} already exists.`;
    }
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await connection.end();
  }
};

module.exports = isUniqueValidator;
