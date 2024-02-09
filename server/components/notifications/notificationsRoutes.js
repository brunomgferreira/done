const express = require("express");
const router = express.Router();

const {
  saveSubscription,
  sendNotification,
} = require("./notificationsController");

router.route("/subscription/save").post(saveSubscription);
router.route("/").get(sendNotification);

module.exports = router;
