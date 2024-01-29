const express = require("express");
const router = express.Router();

const {
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
} = require("./tasksController");

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").get(getTask).delete(deleteTask).patch(updateTask);
router.route("/done/:id").patch(concludeTask);
router.route("/day/:day").get(getAllTasksByDay);
router.route("/number/day/:day").get(getNumberOfTasksByDay);
router.route("/done/number/day/:day").get(getNumberOfDoneTasksByDay);
router.route("/overdue/number").get(getNumberOfOverdueTasks);

module.exports = router;
