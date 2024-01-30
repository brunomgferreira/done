const express = require("express");
const router = express.Router();

const {
  getJournal,
  createJournal,
  updateJournal,
  getJournalByDay,
} = require("./journalController");

router.route("/").post(createJournal);
router.route("/:id").get(getJournal).patch(updateJournal);
router.route("/day/:day").get(getJournalByDay);

module.exports = router;
