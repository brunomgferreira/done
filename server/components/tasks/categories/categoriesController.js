const pool = require("../../../db/dbConnect");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../../errors");

const getAllCategories = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;
    const connection = await pool.getConnection();
    const [categories] = await connection.execute(
      "SELECT id, name, color FROM category WHERE user = ? OR id = 1",
      [userId]
    );

    connection.release();

    res.status(StatusCodes.OK).json({ categories, count: categories.length });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const getCategory = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, name, color FROM category WHERE id = ?",
      [categoryID]
    );

    const category = rows[0];

    if (!category) {
      throw new NotFoundError(`No task category with id ${categoryID}`);
    }

    connection.release();

    res.status(StatusCodes.OK).json({ category });
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

const createCategory = async (req, res) => {
  try {
    const {
      body: { name, color },
      user: { userId },
    } = req;

    if (!name || !color) {
      throw new BadRequestError(
        "Missing required attributes in the request body."
      );
    }

    const connection = await pool.getConnection();
    // check if user with userId exists in db
    const [userResult] = await connection.execute(
      "SELECT * FROM user WHERE id = ?",
      [userId]
    );

    if (userResult.length <= 0)
      throw new NotFoundError(`No user with id ${userId}`);

    const [result] = await connection.execute(
      "INSERT INTO category (user, name, color) VALUES (?, ?, ?)",
      [userId, name, color]
    );

    const categoryId = result.insertId;

    connection.release();

    res.status(StatusCodes.CREATED).json(categoryId);
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

const deleteCategory = async (req, res) => {
  const {
    user: { userId },
    params: { id: categoryId },
  } = req;

  try {
    const connection = await pool.getConnection();

    // check if category with categoryId exists in db
    const [taskResult] = await connection.execute(
      "SELECT * FROM category WHERE id = ? AND user = ?",
      [categoryId, userId]
    );

    if (taskResult.length <= 0)
      throw new NotFoundError(`No category with id ${categoryId}`);

    await connection.execute("DELETE FROM category WHERE id = ? AND user = ?", [
      categoryId,
      userId,
    ]);

    connection.release();

    res
      .status(StatusCodes.OK)
      .send(`Category with id ${categoryId} was deleted.`);
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
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
};
