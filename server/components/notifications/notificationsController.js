const pool = require("../../db/dbConnect");
const webpush = require("./webpushConfig");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../errors");

const saveSubscription = async (req, res) => {
  try {
    const {
      body: subscription,
      user: { userId },
    } = req;

    const connection = await pool.getConnection();

    // check if user with userId exists in db
    const [userResult] = await connection.execute(
      "SELECT * FROM user WHERE id = ?",
      [userId]
    );

    if (userResult.length <= 0)
      throw new NotFoundError(`No user with id ${userId}`);

    await connection.execute(
      "DELETE FROM userNotificationSubscription " + "WHERE user = ?",
      [userId]
    );

    await connection.execute(
      "INSERT INTO userNotificationSubscription (user, subscription) VALUES " +
        "(?, ?)",
      [userId, JSON.stringify(subscription)]
    );

    connection.release();

    res.status(StatusCodes.OK).json("Subscription saved!");
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();

    await connection.execute(
      "DELETE FROM userNotificationSubscription " + "WHERE user = ?",
      [userId]
    );

    connection.release();

    res.status(StatusCodes.OK).json("Subscription removed!");
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// Function to use with a push service like firebase
// const sendNotification = async (req, res) => {
//   try {
//     await webpush.sendNotification(subDatabase[0], "Hello world");

//     res.status(StatusCodes.OK).json("Message sent to push service");
//   } catch (error) {
//     throw new InternalServerError(error.message);
//   }
// };

module.exports = { saveSubscription, deleteSubscription };
