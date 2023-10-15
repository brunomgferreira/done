const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: 50,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["todo", "doing", "completed"],
      default: "todo",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
