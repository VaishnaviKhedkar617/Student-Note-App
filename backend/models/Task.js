const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: ["Study", "Assignment", "Exam", "Personal", "Other"],
      required: [true, "Category is required"],
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Priority is required"],
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);