const express = require("express");
const router = express.Router();

const {
  saveSubscription,
  deleteSubscription,
} = require("./notificationsController");

router.route("/subscription").post(saveSubscription).delete(deleteSubscription);
// router.route("/").get(sendNotification);

module.exports = router;
