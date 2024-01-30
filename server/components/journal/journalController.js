const pool = require("../../db/dbConnect");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../errors");

const getJournal = async (req, res) => {
  try {
    const user = req.user;
    const journalEntryId = req.params.id;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT id, notes, entryDate AS date FROM journal WHERE id = ? AND user = ?",
      [journalEntryId, user.userId]
    );

    connection.release();

    const journalEntry = result[0];

    if (!journalEntry) {
      throw new NotFoundError(`No journal entry with id ${journalEntryId}`);
    }

    res.status(StatusCodes.OK).json({ journalEntry });
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

const getJournalByDay = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { day },
    } = req;

    const currentDate = new Date(day);
    const formattedDate = currentDate.toISOString().substring(0, 10);

    const connection = await pool.getConnection();
    const [journalEntries] = await connection.execute(
      "SELECT id, notes, entryDate AS date " +
        "FROM journal " +
        "WHERE journal.user = ? " +
        "AND journal.entryDate = ? ",
      [userId, formattedDate]
    );

    connection.release();

    const journalEntry = journalEntries[0];

    if (!journalEntry) {
      throw new NotFoundError(
        `No journal entry of the user ${userId} in the day ${day}`
      );
    }

    res.status(StatusCodes.OK).json({ journalEntry });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const createJournal = async (req, res) => {
  try {
    const {
      body: { text, date },
      user: { userId },
    } = req;

    const currentDate = new Date(date);
    const formattedDate = currentDate.toISOString().substring(0, 10);

    const connection = await pool.getConnection();
    // check if user with userId exists in db
    const [userResult] = await connection.execute(
      "SELECT * FROM user WHERE id = ?",
      [userId]
    );

    if (userResult.length <= 0)
      throw new NotFoundError(`No user with id ${userId}`);

    const formattedText = text === "" ? null : text;

    const [result] = await connection.execute(
      "INSERT INTO journal (user, notes, entryDate) VALUES (?, ?, ?)",
      [userId, formattedText, formattedDate]
    );

    const journalEntryId = result.insertId;
    connection.release();

    res.status(StatusCodes.CREATED).json({ journalEntryId });
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

const updateJournal = async (req, res) => {
  try {
    const {
      body: { text },
      user: { userId },
      params: { id: journalEntryId },
    } = req;

    const connection = await pool.getConnection();

    // check if journal entry with journalEntryId exists in db
    const [result] = await connection.execute(
      "SELECT * FROM journal WHERE id=? AND user=?",
      [journalEntryId, userId]
    );

    if (result.length > 0) {
      // update journal entry in db
      await connection.execute(
        "UPDATE journal SET notes = ? WHERE id = ? AND user = ?",
        [text, journalEntryId, userId]
      );

      connection.release();

      res.status(StatusCodes.OK).json({ journalEntryId });
    } else {
      throw new NotFoundError(`No journal entry with id ${journalEntryId}`);
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

module.exports = {
  getJournal,
  createJournal,
  getJournalByDay,
  createJournal,
  updateJournal,
};
