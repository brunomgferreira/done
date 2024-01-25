const express = require("express");
const router = express.Router();
const {
  getAllRepeatIntervals,
  getRepeatIntervals,
} = require("./repeatIntervalsController");

router.route("/").get(getAllRepeatIntervals);
router.route("/:id").get(getRepeatIntervals);

module.exports = router;
