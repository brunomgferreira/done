const mysql = require("mysql2/promise");
const dbConfig = require("../../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../errors");

const getAllTasks = async (req, res) => {
  try {
    const user = req.user;
    const connection = await mysql.createConnection(dbConfig);
    const [tasks] = await connection.execute(
      "SELECT task.id AS taskId, task.user, task.name AS taskName, task.startDate, task.startTime, task.dueDate, task.dueTime, task.location, task.notes, task.finished, task.finishDate, task.finishTime, category.id AS categoryId, category.name AS categoryName, category.color " +
        "FROM task " +
        "INNER JOIN category ON task.category = category.id " +
        "WHERE task.user = ?",
      [user.userId]
    );
    await Promise.all(
      tasks.map(async (task) => {
        const [taskNotifications] = await connection.execute(
          "SELECT taskNotification.notificationID as id, notification.name " +
            "FROM taskNotification " +
            "INNER JOIN notification ON taskNotification.notificationID = notification.id " +
            "WHERE taskNotification.taskID = ?",
          [task.taskId]
        );

        const [taskRepeatIntervals] = await connection.execute(
          "SELECT taskRepeatInterval.repeatIntervalID as id, repeatInterval.name " +
            "FROM taskRepeatInterval " +
            "INNER JOIN repeatInterval ON taskRepeatInterval.repeatIntervalID = repeatInterval.id " +
            "WHERE taskRepeatInterval.taskID = ?",
          [task.taskId]
        );
        task.notifications = taskNotifications;
        task.repeatIntervals = taskRepeatIntervals;
      })
    );

    res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getTask = async (req, res) => {
  try {
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

const createTask = async (req, res) => {
  try {
    const {
      body: {
        name: taskName,
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
    // check if user with userId exists in db
    const [userResult] = await connection.execute(
      "SELECT * FROM user WHERE id = ?",
      [userId]
    );

    if (userResult.length <= 0)
      throw new NotFoundError(`No user with id ${userId}`);

    const taskNameValue = taskName === "" ? null : taskName;
    const locationValue = location === "" ? null : location;
    const notesValue = notes === "" ? null : notes;

    const [result] = await connection.execute(
      "INSERT INTO task (user, name, category, startDate, startTime, dueTime, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        taskNameValue,
        category.id,
        date,
        startingTime,
        endingTime,
        locationValue,
        notesValue,
      ]
    );

    const taskId = result.insertId;

    repeat.forEach(async (repeatInterval) => {
      await connection.execute(
        "INSERT INTO taskRepeatInterval (taskID, repeatIntervalID) VALUES (?, ?)",
        [taskId, repeatInterval.id]
      );
    });

    notification.forEach(async (notification) => {
      await connection.execute(
        "INSERT INTO taskNotification (taskID, notificationID) VALUES (?, ?)",
        [taskId, notification.id]
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
      repeat.forEach(async (option) => {
        await connection.execute(
          "INSERT INTO taskRepeatInterval (taskID, repeatIntervalID) VALUES (?, ?)",
          [taskId, option.id]
        );
      });

      // update taskNotification db
      await connection.execute(
        "DELETE FROM taskNotification WHERE taskID = ?",
        [taskId]
      );
      notification.forEach(async (option) => {
        await connection.execute(
          "INSERT INTO taskNotification (taskID, notificationID) VALUES (?, ?)",
          [taskId, option.id]
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
      "UPDATE task SET finished = ?, finishDate = ?, finishTime = ? WHERE id = ? AND user = ?",
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
