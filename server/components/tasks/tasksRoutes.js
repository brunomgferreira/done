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
} = require("./tasksController");

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").get(getTask).delete(deleteTask).patch(updateTask);
router.route("/done/:id").patch(concludeTask);
router.route("/day/:day").get(getAllTasksByDay);

module.exports = router;
