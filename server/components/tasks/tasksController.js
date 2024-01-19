const mysql = require("mysql2/promise");
const dbConfig = require("../../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../errors");

const getAllTasks = async (req, res) => {
  const user = req.user;
  const connection = await mysql.createConnection(dbConfig);
  const [tasks] = await connection.execute(
    "SELECT * FROM task WHERE user = ?",
    [user.userId]
  );

  res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
};

const getTask = async (req, res) => {
  const user = req.user;
  const taskID = req.params.id;
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute(
    "SELECT * FROM task WHERE id = ? AND user = ?",
    [taskID, user.userId]
  );

  const task = rows[0];

  if (!task) {
    throw new NotFoundError(`No task with id ${taskID}`);
  }
  res.status(StatusCodes.OK).json({ task });
};

const createTask = async (req, res) => {
  try {
    const {
      body: {
        taskName,
        category,
        location,
        notification,
        repeat,
        notes,
        date,
        startingTime,
        endingTime,
      },
      user: { userId },
    } = req;

    if (
      !taskName ||
      !category ||
      !notification ||
      !repeat ||
      !date ||
      !startingTime ||
      !endingTime
    ) {
      throw new BadRequestError(
        "Missing required attributes in the request body."
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO task (user, name, category, startDate, startTime, finishTime, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        taskName,
        category,
        date,
        startingTime,
        endingTime,
        location,
        notes,
      ]
    );

    const taskId = result.insertId;

    repeat.forEach(async (repeatIntervalId) => {
      await connection.execute(
        "INSERT INTO taskRepeatInterval (taskID, repeatIntervalID) VALUES (?, ?)",
        [taskId, repeatIntervalId]
      );
    });

    notification.forEach(async (notificationId) => {
      await connection.execute(
        "INSERT INTO taskNotification (taskID, notificationID) VALUES (?, ?)",
        [taskId, notificationId]
      );
    });

    res.status(StatusCodes.CREATED).json(taskId);
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

const updateTask = async (req, res) => {
  try {
    const {
      body: { category, location, notification, repeat, notes },
      user: { userId },
      params: { id: taskId },
    } = req;

    if (!category || !notification || !repeat) {
      throw new BadRequestError(
        "Missing required attributes in the request body."
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // check if task with taskId exists in db
    const [taskResult] = await connection.execute(
      "SELECT * FROM task WHERE id=? AND user=?",
      [taskId, userId]
    );

    if (taskResult.length > 0) {
      // update task in db
      await connection.execute(
        "UPDATE task SET category=?, location=?, notes=? WHERE id=? AND user=?",
        [category, location, notes, taskId, userId]
      );

      // update taskRepeatInterval db
      await connection.execute(
        "DELETE FROM taskRepeatInterval WHERE taskID = ?",
        [taskId]
      );
      repeat.forEach(async (repeatIntervalId) => {
        await connection.execute(
          "INSERT INTO taskRepeatInterval (taskID, repeatIntervalID) VALUES (?, ?)",
          [taskId, repeatIntervalId]
        );
      });

      // update taskNotification db
      await connection.execute(
        "DELETE FROM taskNotification WHERE taskID = ?",
        [taskId]
      );
      notification.forEach(async (notificationId) => {
        await connection.execute(
          "INSERT INTO taskNotification (taskID, notificationID) VALUES (?, ?)",
          [taskId, notificationId]
        );
      });

      res.status(StatusCodes.OK).json({ taskId });
    } else {
      throw new NotFoundError(`No task with id ${taskId}`);
    }
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

const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // check if task with taskId exists in db
    const [taskResult] = await connection.execute(
      "SELECT * FROM task WHERE id=? AND user=?",
      [taskId, userId]
    );

    if (taskResult.length <= 0)
      throw new NotFoundError(`No task with id ${taskId}`);

    await connection.execute("DELETE FROM task WHERE id = ? AND user = ?", [
      taskId,
      userId,
    ]);
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

  res.status(StatusCodes.OK).send(`Task with id ${taskId} was deleted.`);
};

const concludeTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // check if task with taskId exists in db
    const [taskResult] = await connection.execute(
      "SELECT * FROM task WHERE id=? AND user=?",
      [taskId, userId]
    );

    if (taskResult.length <= 0)
      throw new NotFoundError(`No task with id ${taskId}`);

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    await connection.execute(
      "UPDATE task SET finished = ?, actualFinishDate = ?, actualFinishTime = ? WHERE id = ? AND user = ?",
      [true, formattedDate, formattedTime, taskId, userId]
    );
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

  res.status(StatusCodes.OK).send(`Task with id ${taskId} was marked as done.`);
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  concludeTask,
};
