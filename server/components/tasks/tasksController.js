const pool = require("../../db/dbConnect");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../errors");

const getAllTasks = async (req, res) => {
  try {
    const user = req.user;
    const connection = await pool.getConnection();
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

    connection.release();

    res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getAllTasksByDay = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { day },
    } = req;
    const currentDate = new Date(day);
    const formattedDate = currentDate.toISOString().substring(0, 10);

    await createAllRepeatedTasks(userId, day);

    const connection = await pool.getConnection();
    const [tasks] = await connection.execute(
      "SELECT task.id AS taskId, task.user, task.name AS taskName, task.startDate, task.startTime, task.dueDate, task.dueTime, task.location, task.notes, task.finished, task.finishDate, task.finishTime, category.id AS categoryId, category.name AS categoryName, category.color " +
        "FROM task " +
        "INNER JOIN category ON task.category = category.id " +
        "WHERE task.user = ? " +
        "AND (DATE(task.startDate) = DATE(?) " +
        "OR ((DATE(task.dueDate) < CURDATE() OR (DATE(task.dueDate) = CURDATE() AND task.dueTime <= CURTIME())) AND task.finished = false AND DATE(task.startDate) <= DATE(?)))",
      [userId, formattedDate, formattedDate]
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

    connection.release();

    res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const createAllRepeatedTasks = async (userId, day) => {
  try {
    const currentDate = new Date(day);
    const formattedDate = currentDate.toISOString().substring(0, 10);

    const connection = await pool.getConnection();
    const [tasks] = await connection.execute(
      "SELECT task.id AS taskId, task.user, task.name AS taskName, task.startDate, task.startTime, task.dueDate, task.dueTime, task.location, task.notes, task.finished, task.finishDate, task.finishTime, task.category AS categoryId " +
        "FROM task " +
        "WHERE task.user = ? " +
        "AND task.finished = FALSE " +
        "AND task.startDate < ?",
      [userId, formattedDate]
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
          "SELECT taskRepeatInterval.repeatIntervalID as id, repeatInterval.name, taskRepeatInterval.originalTaskID, taskRepeatInterval.repeatValidity " +
            "FROM taskRepeatInterval " +
            "INNER JOIN repeatInterval ON taskRepeatInterval.repeatIntervalID = repeatInterval.id " +
            "WHERE taskRepeatInterval.taskID = ? " +
            "AND taskRepeatInterval.originalTaskID IS NULL " +
            "AND (taskRepeatInterval.repeatValidity >= ? OR taskRepeatInterval.repeatValidity IS NULL) " +
            "AND taskRepeatInterval.repeatIntervalID != 1",
          [task.taskId, formattedDate]
        );
        task.notifications = taskNotifications;
        task.repeatIntervals = taskRepeatIntervals;
      })
    );

    const filteredTasks = tasks.filter(
      (task) =>
        task.repeatIntervals.length > 0 &&
        task.repeatIntervals.every(
          (repeatInterval) => repeatInterval.originalTaskID === null
        )
    );

    connection.release();

    await Promise.all(
      filteredTasks.map(async (task) => {
        if (await needsToBeCreatedRepeatedTask(task, userId, day))
          await createRepeatedTask(
            userId,
            task.taskId,
            task.taskName,
            task.categoryId,
            task.location,
            task.notifications,
            task.repeatIntervals,
            task.notes,
            formattedDate,
            task.startTime,
            task.dueTime
          );
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const needsToBeCreatedRepeatedTask = async (task, userId, day) => {
  try {
    const currentDate = new Date(day);
    const formattedDate = currentDate.toISOString().substring(0, 10);
    const currentMonthDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentWeekDay = currentDate
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    const taskDate = new Date(task.startDate);
    const taskWeekDay = taskDate
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const taskMonthDay = taskDate.getDate();
    const taskMonth = taskDate.getMonth();

    let result = false;

    for (const repeatInterval of task.repeatIntervals) {
      if (
        repeatInterval.id === 2 ||
        (repeatInterval.id === 3 && currentWeekDay === taskWeekDay) ||
        (repeatInterval.id === 4 && currentMonthDay === taskMonthDay) ||
        (repeatInterval.id === 5 &&
          currentMonthDay === taskMonthDay &&
          currentMonth === taskMonth)
      ) {
        result = true;
        break;
      }
    }

    if (!result) return false;

    const connection = await pool.getConnection();
    const [tasks] = await connection.execute(
      "SELECT task.id AS taskId, task.user, task.name AS taskName, task.startDate, task.startTime, task.dueDate, task.dueTime, task.location, task.notes, task.finished, task.finishDate, task.finishTime, task.category AS categoryId " +
        "FROM task " +
        "WHERE task.user = ? " +
        "AND task.startDate = ?",
      [userId, formattedDate]
    );

    await Promise.all(
      tasks.map(async (value) => {
        const [taskRepeatIntervals] = await connection.execute(
          "SELECT taskRepeatInterval.repeatIntervalID as id, repeatInterval.name, taskRepeatInterval.originalTaskID, taskRepeatInterval.repeatValidity " +
            "FROM taskRepeatInterval " +
            "INNER JOIN repeatInterval ON taskRepeatInterval.repeatIntervalID = repeatInterval.id " +
            "WHERE taskRepeatInterval.taskID = ? " +
            "AND taskRepeatInterval.originalTaskID = ? " +
            "AND taskRepeatInterval.repeatIntervalID != 1 ",
          [value.taskId, task.taskId]
        );

        if (taskRepeatIntervals.length > 0) {
          result = false;
        }
      })
    );

    connection.release();

    return result;
  } catch (error) {
    console.log(error);
  }
};

const createRepeatedTask = async (
  userId,
  originalTaskId,
  taskName,
  category,
  location,
  notification,
  repeat,
  notes,
  date,
  startingTime,
  endingTime
) => {
  try {
    const connection = await pool.getConnection();

    const taskNameValue = taskName === "" ? null : taskName;
    const locationValue = location === "" ? null : location;
    const notesValue = notes === "" ? null : notes;

    const [result] = await connection.execute(
      "INSERT INTO task (user, name, category, startDate, startTime, dueTime, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        taskNameValue,
        category,
        date,
        startingTime,
        endingTime,
        locationValue,
        notesValue,
      ]
    );

    const taskId = result.insertId;

    await Promise.all([
      repeat.forEach(async (repeatInterval) => {
        await connection.execute(
          "INSERT INTO taskRepeatInterval (taskID, repeatIntervalID, originalTaskID, repeatValidity) " +
            "VALUES (?, ?, ?, ?)",
          [
            taskId,
            repeatInterval.id,
            originalTaskId,
            repeatInterval.repeatValidity,
          ]
        );
      }),

      notification.forEach(async (notification) => {
        await connection.execute(
          "INSERT INTO taskNotification (taskID, notificationID) VALUES (?, ?)",
          [taskId, notification.id]
        );
      }),
    ]);

    connection.release();

    return taskId;
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNumberOfTasksByDay = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { day },
    } = req;
    const currentDate = new Date(day);
    const formattedDate = currentDate.toISOString().substring(0, 10);

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT count(*) numberOfTasks " +
        "FROM task " +
        "INNER JOIN category ON task.category = category.id " +
        "WHERE task.user = ? " +
        "AND task.startDate = ?",
      [userId, formattedDate]
    );

    const numberOfTasks = result[0].numberOfTasks;

    connection.release();

    res.status(StatusCodes.OK).json({ numberOfTasks });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNumberOfDoneTasksByDay = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { day },
    } = req;
    const currentDate = new Date(day);
    const formattedDate = currentDate.toISOString().substring(0, 10);

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT count(*) numberOfTasks " +
        "FROM task " +
        "INNER JOIN category ON task.category = category.id " +
        "WHERE task.user = ? " +
        "AND task.startDate = ? " +
        "AND task.finished = true",
      [userId, formattedDate]
    );

    const numberOfDoneTasks = result[0].numberOfTasks;

    connection.release();

    res.status(StatusCodes.OK).json({ numberOfDoneTasks });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNumberOfOverdueTasks = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT count(*) numberOfOverdueTasks " +
        "FROM task " +
        "WHERE task.user = ? " +
        "AND ((task.dueDate < CURDATE() OR (task.dueDate = CURDATE() AND task.dueTime <= CURTIME())) AND task.finished = false AND task.startDate <= CURDATE())",
      [userId]
    );

    const numberOfOverdueTasks = result[0].numberOfOverdueTasks;

    connection.release();

    res.status(StatusCodes.OK).json({ numberOfOverdueTasks });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getTask = async (req, res) => {
  try {
    const user = req.user;
    const taskID = req.params.id;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM task WHERE id = ? AND user = ?",
      [taskID, user.userId]
    );

    const task = rows[0];

    if (!task) {
      throw new NotFoundError(`No task with id ${taskID}`);
    }

    connection.release();

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

    const connection = await pool.getConnection();
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

    const oneDayAheadDate = new Date(date);
    oneDayAheadDate.setDate(oneDayAheadDate.getDate() + 1);
    const twoDaysAheadDate = new Date(date);
    twoDaysAheadDate.setDate(twoDaysAheadDate.getDate() + 2);

    await createAllRepeatedTasks(userId, oneDayAheadDate);
    await createAllRepeatedTasks(userId, twoDaysAheadDate);

    connection.release();

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
      body: { category, location, notification, notes },
      user: { userId },
      params: { id: taskId },
    } = req;

    if (!category || !notification) {
      throw new BadRequestError(
        "Missing required attributes in the request body."
      );
    }

    const connection = await pool.getConnection();

    // check if task with taskId exists in db
    const [taskResult] = await connection.execute(
      "SELECT * FROM task WHERE id=? AND user=?",
      [taskId, userId]
    );

    const [rows] = await connection.execute(
      "SELECT * " +
        "FROM taskRepeatInterval " +
        "WHERE taskRepeatInterval.taskID = ?",
      [taskId]
    );

    const originalTaskId = rows[0].originalTaskID
      ? rows[0].originalTaskID
      : taskId;

    let [taskIdArray] = await connection.execute(
      "SELECT distinct t2.id AS taskID " +
        "FROM task t2 " +
        "JOIN taskRepeatInterval ON t2.id = taskRepeatInterval.taskID " +
        "WHERE originalTaskID = ? AND t2.user = ?",
      [originalTaskId, userId]
    );

    taskIdArray = taskIdArray.map((option) => option.taskID);

    taskIdArray.push(originalTaskId);

    const placeholders = taskIdArray.map(() => "?").join(",");

    if (taskResult.length > 0) {
      // update task in db
      await connection.execute(
        "UPDATE task SET category=?, location=?, notes=? " +
          `WHERE id IN (${placeholders})`,
        [category, location, notes, ...taskIdArray]
      );

      // update taskNotification db
      taskIdArray.forEach(async (id) => {
        await connection.execute(
          "DELETE FROM taskNotification WHERE taskID = ?",
          [id]
        );
        notification.forEach(async (option) => {
          await connection.execute(
            "INSERT INTO taskNotification (taskID, notificationID) VALUES (?, ?)",
            [id, option.id]
          );
        });
      });

      connection.release();

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
    const connection = await pool.getConnection();

    // check if task with taskId exists in db
    const [taskResult] = await connection.execute(
      "SELECT * FROM task WHERE id=? AND user=?",
      [taskId, userId]
    );

    if (taskResult.length <= 0)
      throw new NotFoundError(`No task with id ${taskId}`);

    await connection.execute(
      "DELETE FROM task " +
        "WHERE id IN " +
        "(SELECT DISTINCT taskID " +
        "FROM " +
        "(SELECT t2.id AS taskID " +
        "FROM task t2 " +
        "JOIN taskRepeatInterval ON t2.id = taskRepeatInterval.taskID " +
        "WHERE originalTaskID = ? AND t2.user = ?) AS subquery) " +
        "OR id IN " +
        "(SELECT DISTINCT taskID " +
        "FROM " +
        "(SELECT taskRepeatInterval2.originalTaskID AS taskID " +
        "FROM task t3 " +
        "JOIN taskRepeatInterval taskRepeatInterval2 ON t3.id = taskRepeatInterval2.taskID " +
        "WHERE t3.id = ? AND t3.user = ?) AS subquery2) ",
      [taskId, userId, taskId, userId]
    );

    await connection.execute("DELETE FROM task WHERE id = ? AND user = ?", [
      taskId,
      userId,
    ]);

    connection.release();

    res
      .status(StatusCodes.OK)
      .send(`Task with id ${taskId} and it's related tasks were deleted.`);
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

const concludeTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  try {
    const connection = await pool.getConnection();

    const [tasks] = await connection.execute(
      "SELECT task.id AS taskId, task.user, task.name AS taskName, task.startDate, task.startTime, task.dueDate, task.dueTime, task.location, task.notes, task.finished, task.finishDate, task.finishTime, task.category AS categoryId " +
        "FROM task " +
        "WHERE id = ? AND user = ? ",
      [taskId, userId]
    );

    if (tasks.length <= 0) throw new NotFoundError(`No task with id ${taskId}`);

    const [result] = await connection.execute(
      "SELECT distinct id, originalTaskID, repeatValidity " +
        "FROM task, taskRepeatInterval " +
        "WHERE id = taskRepeatInterval.taskID " +
        "AND id = ? AND user = ? " +
        "AND repeatIntervalID != 1",
      [taskId, userId]
    );

    if (result.length > 0) {
      const originalTaskId = result[0].originalTaskID;
      const repeatValidity = result[0].repeatValidity;

      if (!originalTaskId) {
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
              "SELECT taskRepeatInterval.repeatIntervalID as id, repeatInterval.name, taskRepeatInterval.originalTaskID, taskRepeatInterval.repeatValidity " +
                "FROM taskRepeatInterval " +
                "INNER JOIN repeatInterval ON taskRepeatInterval.repeatIntervalID = repeatInterval.id " +
                "WHERE taskRepeatInterval.taskID = ?",
              [task.taskId]
            );
            task.notifications = taskNotifications;
            task.repeatIntervals = taskRepeatIntervals;
          })
        );

        const task = tasks[0];
        await createNextRepeatedTask(task, task.taskId, repeatValidity);
      }
    }

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

    connection.release();

    res
      .status(StatusCodes.OK)
      .send(`Task with id ${taskId} was marked as done.`);
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

const createNextRepeatedTask = async (task, originalTaskId, repeatValidity) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT startDate " + "FROM task " + "WHERE id = ? AND user = ?",
      [originalTaskId, task.user]
    );

    const currentDate = new Date(result[0].startDate);
    currentDate.setDate(currentDate.getDate() + 1);
    let formattedDate = currentDate.toISOString().substring(0, 10);

    let repeatTaskId;

    while (true) {
      if (repeatValidity && currentDate > repeatValidity) break;
      if (
        isNewRepeatTaskDateValid(
          currentDate,
          task.startDate,
          repeatValidity,
          task.repeatIntervals
        )
      ) {
        const res = await existsRepeatedTask(currentDate, task.taskId);
        const repeatedTaskExists = res.repeatedTaskExists;
        repeatTaskId = res.taskId;
        if (!repeatedTaskExists) {
          const newTaskId = await createRepeatedTask(
            task.user,
            task.taskId,
            task.taskName,
            task.categoryId,
            task.location,
            task.notifications,
            task.repeatIntervals,
            task.notes,
            formattedDate,
            task.startTime,
            task.dueTime
          );
          repeatTaskId = newTaskId;
          break;
        } else if (!res.finished) break;
      }

      currentDate.setDate(currentDate.getDate() + 1);
      formattedDate = currentDate.toISOString().substring(0, 10);
    }

    await connection.execute(
      "UPDATE taskRepeatInterval SET originalTaskID = ? " +
        "WHERE originalTaskID = ? " +
        "AND originalTaskID NOT IN " +
        "(SELECT id FROM task WHERE task.finished = TRUE)",
      [repeatTaskId, originalTaskId]
    );

    await connection.execute(
      "UPDATE taskRepeatInterval SET originalTaskID = null " +
        "WHERE taskID = ?",
      [repeatTaskId]
    );

    connection.release();
  } catch (error) {
    console.log(error.message);
  }
};

const isNewRepeatTaskDateValid = (
  currentDate,
  startDate,
  repeatValidity,
  repeatIntervals
) => {
  if (repeatValidity && currentDate > repeatValidity) return false;

  const formattedDate = currentDate.toISOString().substring(0, 10);
  const currentMonthDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentWeekDay = currentDate
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();

  const taskDate = new Date(startDate);
  const taskWeekDay = taskDate
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const taskMonthDay = taskDate.getDate();
  const taskMonth = taskDate.getMonth();

  let result = false;

  for (const repeatInterval of repeatIntervals) {
    if (
      repeatInterval.id === 2 ||
      (repeatInterval.id === 3 && currentWeekDay === taskWeekDay) ||
      (repeatInterval.id === 4 && currentMonthDay === taskMonthDay) ||
      (repeatInterval.id === 5 &&
        currentMonthDay === taskMonthDay &&
        currentMonth === taskMonth)
    ) {
      result = true;
      break;
    }
  }

  return result;
};

const existsRepeatedTask = async (day, originalTaskId) => {
  try {
    const connection = await pool.getConnection();
    const [tasks] = await connection.execute(
      "SELECT task.id, task.finished, taskRepeatInterval.originalTaskID, taskRepeatInterval.repeatValidity " +
        "FROM task, taskRepeatInterval " +
        "WHERE task.id = taskRepeatInterval.taskID " +
        "AND DATE(task.startDate) = DATE(?) " +
        "AND taskRepeatInterval.originalTaskID = ?",
      [day, originalTaskId]
    );

    connection.release();

    if (tasks.length > 0) {
      const task = tasks[0];
      return {
        repeatedTaskExists: true,
        taskId: task.id,
        finished: task.finished,
      };
    }
    return { repeatedTaskExists: false, taskId: null, finished: 1 };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  concludeTask,
  getAllTasksByDay,
  getNumberOfTasksByDay,
  getNumberOfDoneTasksByDay,
  getNumberOfOverdueTasks,
  createAllRepeatedTasks,
};
