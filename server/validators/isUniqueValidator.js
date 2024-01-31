const pool = require("../db/dbConnect");

const isUniqueValidator = async (value, table, column) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ?`,
      [value]
    );

    connection.release();

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
    if (connection) connection.release();
  }
};

module.exports = isUniqueValidator;
