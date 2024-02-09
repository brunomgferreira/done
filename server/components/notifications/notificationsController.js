const pool = require("../../db/dbConnect");
const webpush = require("./webpushConfig");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../errors");

const subDatabase = [];

const saveSubscription = async (req, res) => {
  try {
    console.log(req.body);
    subDatabase.push(req.body);

    // const connection = await pool.getConnection();

    // const [tasks] = await connection.execute(
    //   "SELECT task.id AS taskId, task.user, task.name AS taskName, task.startDate, task.startTime, task.dueDate, task.dueTime, task.location, task.notes, task.finished, task.finishDate, task.finishTime, category.id AS categoryId, category.name AS categoryName, category.color " +
    //     "FROM task " +
    //     "INNER JOIN category ON task.category = category.id " +
    //     "WHERE task.user = ?",
    //   [user.userId]
    // );

    // connection.release();

    res.status(StatusCodes.OK).json("Subscription saved!");
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// Function to use with a push service like firebase
const sendNotification = async (req, res) => {
  try {
    await webpush.sendNotification(subDatabase[0], "Hello world");

    res.status(StatusCodes.OK).json("Message sent to push service");
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

module.exports = { saveSubscription, sendNotification };
