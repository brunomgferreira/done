const pool = require("../../db/dbConnect");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../errors");

// AVERAGE OVERDUE TIME
const getAverageOverdueTime = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT AVG(UNIX_TIMESTAMP(DATE(task.dueDate)) - UNIX_TIMESTAMP(DATE(task.finishDate)) + TIMESTAMPDIFF(SECOND, TIME(task.dueTime), TIME(task.finishTime))) AS averageOverdueTime " +
        "FROM task " +
        "WHERE task.finished = true " +
        "AND task.user = ? " +
        "AND ((task.finished = FALSE AND (DATE(task.dueDate) < CURDATE() OR (DATE(task.dueDate) = CURDATE() AND task.dueTime <= CURTIME()))) " +
        "OR (task.finished = TRUE  " +
        "AND (DATE(task.dueDate) < DATE(task.finishDate)  " +
        "OR (DATE(task.dueDate) = DATE(task.finishDate) AND TIME(task.dueTime) <= TIME(task.finishTime)))))",
      [userId]
    );

    const averageOverdueTime = result[0].averageOverdueTime
      ? result[0].averageOverdueTime
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageOverdueTime });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS PER DAY
const getAverageNumberOfTasksPerDay = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT round(avg(numberOfTasks), 2) AS averageNumberOfTasksPerDay " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks " +
        "FROM (SELECT DISTINCT startDate " +
        "FROM task " +
        "WHERE task.user = ?) AS all_dates " +
        "LEFT JOIN task ON all_dates.startDate = task.startDate AND task.user = ? " +
        "GROUP BY all_dates.startDate) AS subquery",
      [userId, userId]
    );

    const averageNumberOfTasksPerDay = result[0].averageNumberOfTasksPerDay
      ? result[0].averageNumberOfTasksPerDay
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksPerDay });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS DONE PER DAY
const getAverageNumberOfTasksDonePerDay = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT round(avg(numberOfTasks), 2) AS averageNumberOfTasksDonePerDay " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks " +
        "FROM (SELECT DISTINCT finishDate " +
        "FROM task " +
        "WHERE task.user = ? " +
        "UNION " +
        "SELECT DISTINCT startDate " +
        "FROM task " +
        "WHERE task.user = ?) AS all_dates " +
        "LEFT JOIN task ON all_dates.finishDate = task.finishDate AND task.user = ? AND task.finished = TRUE " +
        "GROUP BY all_dates.finishDate) AS subquery",
      [userId, userId, userId]
    );

    const averageNumberOfTasksDonePerDay = result[0]
      .averageNumberOfTasksDonePerDay
      ? result[0].averageNumberOfTasksDonePerDay
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksDonePerDay });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS OVERDUE PER DAY
const getAverageNumberOfTasksOverduePerDay = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT ROUND(AVG(numberOfTasks), 2) averageNumberOfTasksOverduePerDay " +
        "FROM (SELECT COUNT(task.id) AS numberOfTasks, all_dates.startDate " +
        "FROM (SELECT DISTINCT startDate " +
        "FROM task " +
        "WHERE task.user = ?) AS all_dates " +
        "LEFT JOIN task " +
        "ON all_dates.startDate = task.startDate " +
        "AND task.user = ? " +
        "AND ((task.finished = FALSE AND (DATE(task.dueDate) < CURDATE() OR (DATE(task.dueDate) = CURDATE() AND task.dueTime <= CURTIME()))) " +
        "OR (task.finished = TRUE " +
        "AND (DATE(task.dueDate) < DATE(task.finishDate)  " +
        "OR (DATE(task.dueDate) = DATE(task.finishDate) AND TIME(task.dueTime) <= TIME(task.finishTime))))) " +
        "GROUP BY all_dates.startDate) subquery",
      [userId, userId]
    );

    const averageNumberOfTasksOverduePerDay = result[0]
      .averageNumberOfTasksOverduePerDay
      ? result[0].averageNumberOfTasksOverduePerDay
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksOverduePerDay });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS PER WEEK
const getAverageNumberOfTasksPerWeek = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT round(avg(numberOfTasks), 2) AS averageNumberOfTasksPerWeek " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, WEEK(task.startDate) AS weekNumber " +
        "FROM task " +
        "WHERE task.user = ? " +
        "GROUP BY weekNumber) AS subquery",
      [userId]
    );

    const averageNumberOfTasksPerWeek = result[0].averageNumberOfTasksPerWeek
      ? result[0].averageNumberOfTasksPerWeek
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksPerWeek });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS DONE PER WEEK
const getAverageNumberOfTasksDonePerWeek = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT ROUND(AVG(numberOfTasks), 2) AS averageNumberOfTasksDonePerWeek " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, WEEK(task.finishDate) AS weekNumber " +
        "FROM task " +
        "WHERE task.user = ? AND task.finished = TRUE " +
        "GROUP BY weekNumber) AS subquery ",
      [userId]
    );

    const averageNumberOfTasksDonePerWeek = result[0]
      .averageNumberOfTasksDonePerWeek
      ? result[0].averageNumberOfTasksDonePerWeek
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksDonePerWeek });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS OVERDUE PER WEEK
const getAverageNumberOfTasksOverduePerWeek = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT ROUND(AVG(numberOfTasks), 2) AS averageNumberOfTasksOverduePerWeek " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, WEEK(task.startDate) AS weekNumber " +
        "FROM task " +
        "WHERE task.user = ? " +
        "AND ((task.finished = FALSE AND (DATE(task.dueDate) < CURDATE() " +
        "OR (DATE(task.dueDate) = CURDATE() AND task.dueTime <= CURTIME()))) " +
        "OR (task.finished = TRUE AND (DATE(task.dueDate) < DATE(task.finishDate) " +
        "OR (DATE(task.dueDate) = DATE(task.finishDate) AND TIME(task.dueTime) <= TIME(task.finishTime))))) " +
        "GROUP BY weekNumber) AS subquery ",
      [userId]
    );

    const averageNumberOfTasksOverduePerWeek = result[0]
      .averageNumberOfTasksOverduePerWeek
      ? result[0].averageNumberOfTasksOverduePerWeek
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksOverduePerWeek });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS PER MONTH
const getAverageNumberOfTasksPerMonth = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT round(avg(numberOfTasks), 2) AS averageNumberOfTasksPerMonth " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, MONTH(task.startDate) AS monthNumber " +
        "FROM task " +
        "WHERE task.user = ? " +
        "GROUP BY monthNumber) AS subquery",
      [userId]
    );

    const averageNumberOfTasksPerMonth = result[0].averageNumberOfTasksPerMonth
      ? result[0].averageNumberOfTasksPerMonth
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksPerMonth });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS DONE PER MONTH
const getAverageNumberOfTasksDonePerMonth = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT ROUND(AVG(numberOfTasks), 2) AS averageNumberOfTasksDonePerMonth " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, MONTH(task.finishDate) AS monthNumber " +
        "FROM task " +
        "WHERE task.user = ? AND task.finished = TRUE " +
        "GROUP BY monthNumber) AS subquery ",
      [userId]
    );

    const averageNumberOfTasksDonePerMonth = result[0]
      .averageNumberOfTasksDonePerMonth
      ? result[0].averageNumberOfTasksDonePerMonth
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksDonePerMonth });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS OVERDUE PER MONTH
const getAverageNumberOfTasksOverduePerMonth = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT ROUND(AVG(numberOfTasks), 2) AS averageNumberOfTasksOverduePerMonth " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, MONTH(task.startDate) AS monthNumber " +
        "FROM task " +
        "WHERE task.user = ? " +
        "AND ((task.finished = FALSE AND (DATE(task.dueDate) < CURDATE() " +
        "OR (DATE(task.dueDate) = CURDATE() AND task.dueTime <= CURTIME()))) " +
        "OR (task.finished = TRUE AND (DATE(task.dueDate) < DATE(task.finishDate) " +
        "OR (DATE(task.dueDate) = DATE(task.finishDate) AND TIME(task.dueTime) <= TIME(task.finishTime))))) " +
        "GROUP BY monthNumber) AS subquery ",
      [userId]
    );

    const averageNumberOfTasksOverduePerMonth = result[0]
      .averageNumberOfTasksOverduePerMonth
      ? result[0].averageNumberOfTasksOverduePerMonth
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksOverduePerMonth });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS PER YEAR
const getAverageNumberOfTasksPerYear = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT round(avg(numberOfTasks), 2) AS averageNumberOfTasksPerYear " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, MONTH(task.startDate) AS yearNumber " +
        "FROM task " +
        "WHERE task.user = ? " +
        "GROUP BY yearNumber) AS subquery",
      [userId]
    );

    const averageNumberOfTasksPerYear = result[0].averageNumberOfTasksPerYear
      ? result[0].averageNumberOfTasksPerYear
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksPerYear });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS DONE PER YEAR
const getAverageNumberOfTasksDonePerYear = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT ROUND(AVG(numberOfTasks), 2) AS averageNumberOfTasksDonePerYear " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, YEAR(task.finishDate) AS yearNumber " +
        "FROM task " +
        "WHERE task.user = ? AND task.finished = TRUE " +
        "GROUP BY yearNumber) AS subquery ",
      [userId]
    );

    const averageNumberOfTasksDonePerYear = result[0]
      .averageNumberOfTasksDonePerYear
      ? result[0].averageNumberOfTasksDonePerYear
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksDonePerYear });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// AVERGAGE NUMBER OF TASKS OVERDUE PER YEAR
const getAverageNumberOfTasksOverduePerYear = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT ROUND(AVG(numberOfTasks), 2) AS averageNumberOfTasksOverduePerYear " +
        "FROM (SELECT COALESCE(COUNT(task.id), 0) AS numberOfTasks, YEAR(task.startDate) AS yearNumber " +
        "FROM task " +
        "WHERE task.user = ? " +
        "AND ((task.finished = FALSE AND (DATE(task.dueDate) < CURDATE() " +
        "OR (DATE(task.dueDate) = CURDATE() AND task.dueTime <= CURTIME()))) " +
        "OR (task.finished = TRUE AND (DATE(task.dueDate) < DATE(task.finishDate) " +
        "OR (DATE(task.dueDate) = DATE(task.finishDate) AND TIME(task.dueTime) <= TIME(task.finishTime))))) " +
        "GROUP BY yearNumber) AS subquery ",
      [userId]
    );

    const averageNumberOfTasksOverduePerYear = result[0]
      .averageNumberOfTasksOverduePerYear
      ? result[0].averageNumberOfTasksOverduePerYear
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ averageNumberOfTasksOverduePerYear });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNumberOfTasksPerCategory = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT category.id, category.name, category.color, IFNULL(count(task.id), 0) value " +
        "FROM category " +
        "LEFT JOIN task ON task.category = category.id " +
        "AND task.user = ? " +
        "GROUP BY category.id",
      [userId]
    );

    connection.release();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNumberOfTasksDone = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT count(*) numberOfTasksDone " +
        "FROM task " +
        "WHERE  task.user = ? " +
        "AND task.finished = TRUE",
      [userId]
    );

    const numberOfTasksDone = result[0].numberOfTasksDone
      ? result[0].numberOfTasksDone
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ numberOfTasksDone });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNumberOfTasksDoneOverdue = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT count(*) numberOfTasksDoneOverdue " +
        "FROM task " +
        "WHERE task.user = ? " +
        "AND (task.finished = TRUE " +
        "AND (DATE(task.dueDate) < DATE(task.finishDate)  " +
        "OR (DATE(task.dueDate) = DATE(task.finishDate) AND TIME(task.dueTime) <= TIME(task.finishTime))))",
      [userId]
    );

    const numberOfTasksDoneOverdue = result[0].numberOfTasksDoneOverdue
      ? result[0].numberOfTasksDoneOverdue
      : 0;

    connection.release();

    res.status(StatusCodes.OK).json({ numberOfTasksDoneOverdue });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getNumberOfTasks = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT DATE(task.startDate) AS date, count(*) AS value " +
        "FROM task " +
        "WHERE task.user = ? " +
        "GROUP BY date",
      [userId]
    );

    connection.release();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getAllTasks = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT id, name, category, location, notes, startDate, startTime, dueDate, dueTime, finished, finishDate, finishTime " +
        "FROM task " +
        "WHERE task.user = ?",
      [userId]
    );

    connection.release();

    res.status(StatusCodes.OK).json({ tasks: result });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT taskNotification.taskID, taskNotification.notificationID " +
        "FROM taskNotification, task " +
        "WHERE task.id = taskNotification.taskID " +
        "AND task.user = ?",
      [userId]
    );

    connection.release();

    res.status(StatusCodes.OK).json({ notifications: result });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getAllRepeat = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT taskRepeatInterval.taskID, taskRepeatInterval.repeatIntervalID, taskRepeatInterval.originalTaskID " +
        "FROM taskRepeatInterval, task " +
        "WHERE task.id = taskRepeatInterval.taskID " +
        "AND task.user = ?",
      [userId]
    );

    connection.release();

    res.status(StatusCodes.OK).json({ repeat: result });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

module.exports = {
  getAverageNumberOfTasksPerDay,
  getAverageNumberOfTasksDonePerDay,
  getAverageNumberOfTasksOverduePerDay,
  getAverageNumberOfTasksPerWeek,
  getAverageNumberOfTasksDonePerWeek,
  getAverageNumberOfTasksOverduePerWeek,
  getAverageNumberOfTasksPerMonth,
  getAverageNumberOfTasksDonePerMonth,
  getAverageNumberOfTasksOverduePerMonth,
  getAverageNumberOfTasksPerYear,
  getAverageNumberOfTasksDonePerYear,
  getAverageNumberOfTasksOverduePerYear,
  getAverageOverdueTime,
  getNumberOfTasksPerCategory,
  getNumberOfTasksDone,
  getNumberOfTasksDoneOverdue,
  getNumberOfTasks,
  getAllTasks,
  getAllNotifications,
  getAllRepeat,
};
