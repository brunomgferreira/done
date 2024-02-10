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

const sendNotifications = async () => {
  try {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:00`;

    const connection = await pool.getConnection();

    const [notifications] = await connection.execute(
      "SELECT taskNotification.notificationID notificationId, userNotificationSubscription.user, subscription " +
        "FROM task, taskNotification, userNotificationSubscription " +
        "WHERE task.id = taskNotification.taskID " +
        "AND task.user = userNotificationSubscription.user " +
        "AND task.finished = false " +
        "AND ( (taskNotification.notificationID = ? " +
        "AND DATE(startDate) = DATE(?) " +
        "AND TIME(startTime) = TIME(?)) " +
        "OR (taskNotification.notificationID = ? " +
        "AND DATE(startDate) = DATE(?) " +
        "AND TIME(startTime) = TIME(?)) " +
        "OR (taskNotification.notificationID = ? " +
        "AND DATE(startDate) = DATE(?) " +
        "AND TIME(startTime) = TIME(?)) " +
        "OR (taskNotification.notificationID = ? " +
        "AND DATE(startDate) = DATE(?) " +
        "AND TIME(startTime) = TIME(?)) ) " +
        "GROUP BY userNotificationSubscription.user, taskNotification.notificationID",
      [
        2,
        `${year}-${month}-${day}`,
        `${hours}:${minutes}:00`,
        3,
        `${year}-${month}-${day}`,
        `${hours}:${minutes + 10}:00`,
        4,
        `${year}-${month}-${day}`,
        `${hours + 1}:${minutes}:00`,
        5,
        `${year}-${month}-${day + 1}`,
        `${hours}:${minutes}:00`,
      ]
    );

    connection.release();

    for (const notification of notifications) {
      const id = notification.notificationId;
      const subscription = JSON.parse(notification.subscription);

      if (id == 2) {
        await webpush.sendNotification(subscription, "You have a task now!");
      } else if (id == 3) {
        await webpush.sendNotification(
          subscription,
          "You have a task starting in 10 minutes!"
        );
      } else if (id == 4) {
        await webpush.sendNotification(
          subscription,
          "You have a task starting in 1 hour!"
        );
      } else if (id == 5) {
        await webpush.sendNotification(
          subscription,
          "You have a task starting in 1 day!"
        );
      }
    }
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

module.exports = { saveSubscription, deleteSubscription, sendNotifications };
