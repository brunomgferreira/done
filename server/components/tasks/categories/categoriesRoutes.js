const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
} = require("./categoriesController");

router.route("/").get(getAllCategories).post(createCategory);
router.route("/:id").get(getCategory).delete(deleteCategory);

module.exports = router;
