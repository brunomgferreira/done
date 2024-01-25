const mysql = require("mysql2/promise");
const dbConfig = require("../../../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../errors");

const getAllRepeatIntervals = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [repeatIntervals] = await connection.execute(
      "SELECT * FROM repeatInterval"
    );

    res
      .status(StatusCodes.OK)
      .json({ repeatIntervals, count: repeatIntervals.length });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getRepeatIntervals = async (req, res) => {
  try {
    const repeatID = req.params.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM repeatInterval WHERE id = ?",
      [repeatID]
    );

    const repeatInterval = rows[0];

    if (!repeatInterval) {
      throw new NotFoundError(`No task repeat intervals with id ${repeatID}`);
    }
    res.status(StatusCodes.OK).json({ repeatInterval });
  } catch (error) {
    if (
      error.statusCode == StatusCodes.NOT_FOUND ||
      error.statusCode == StatusCodes.BAD_REQUEST
    ) {
      throw error;
    } else {
      throw new InternalServerError(error.message);
    }
  }
};

module.exports = {
  getAllRepeatIntervals,
  getRepeatIntervals,
};
