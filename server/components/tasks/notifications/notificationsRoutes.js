const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  getNotification,
} = require("./notificationsController");

router.route("/").get(getAllNotifications);
router.route("/:id").get(getNotification);

module.exports = router;
