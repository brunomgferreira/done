const mysql = require("mysql2/promise");
const dbConfig = require("../../../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../errors");

const getAllNotifications = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [notifications] = await connection.execute(
      "SELECT * FROM notification"
    );

    res
      .status(StatusCodes.OK)
      .json({ notifications, count: notifications.length });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNotification = async (req, res) => {
  try {
    const notificationID = req.params.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM notification WHERE id = ?",
      [notificationID]
    );

    const notification = rows[0];

    if (!notification) {
      throw new NotFoundError(`No task notification with id ${notificationID}`);
    }
    res.status(StatusCodes.OK).json({ notification });
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
  getAllNotifications,
  getNotification,
};
