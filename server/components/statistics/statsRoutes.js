const express = require("express");
const router = express.Router();

const {
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
} = require("./statsController");

// DAY
router.route("/day/averageTasks/").get(getAverageNumberOfTasksPerDay);
router.route("/day/averageTasksDone/").get(getAverageNumberOfTasksDonePerDay);
router
  .route("/day/averageTasksOverdue/")
  .get(getAverageNumberOfTasksOverduePerDay);

// WEEK
router.route("/week/averageTasks/").get(getAverageNumberOfTasksPerWeek);
router.route("/week/averageTasksDone/").get(getAverageNumberOfTasksDonePerWeek);
router
  .route("/week/averageTasksOverdue/")
  .get(getAverageNumberOfTasksOverduePerWeek);

// MONTH
router.route("/month/averageTasks/").get(getAverageNumberOfTasksPerMonth);
router
  .route("/month/averageTasksDone/")
  .get(getAverageNumberOfTasksDonePerMonth);
router
  .route("/month/averageTasksOverdue/")
  .get(getAverageNumberOfTasksOverduePerMonth);

// YEAR
router.route("/year/averageTasks/").get(getAverageNumberOfTasksPerYear);
router.route("/year/averageTasksDone/").get(getAverageNumberOfTasksDonePerYear);
router
  .route("/year/averageTasksOverdue/")
  .get(getAverageNumberOfTasksOverduePerYear);

// OVERDUE TIME
router.route("/averageOverdueTime/").get(getAverageOverdueTime);

// TASKS PER CATEGORY
router.route("/tasksPerCategory/").get(getNumberOfTasksPerCategory);

// TASKS DONE
router.route("/tasksDone/").get(getNumberOfTasksDone);

// TASKS DONE
router.route("/tasksDoneOverdue/").get(getNumberOfTasksDoneOverdue);

// TASKS
router.route("/numberOfTasks/").get(getNumberOfTasks);

router.route("/tasks/").get(getAllTasks);

router.route("/notifications/").get(getAllNotifications);

router.route("/repeat/").get(getAllRepeat);

module.exports = router;
