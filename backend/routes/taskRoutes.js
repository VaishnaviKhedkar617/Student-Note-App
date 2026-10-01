const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// GET all tasks
router.get("/", async (req, res, next) => {
  try {
    const {
      search,
      category,
      priority,
      status,
      sortBy,
    } = req.query;

    let filter = {};

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Status filter
    if (status === "completed") {
      filter.isCompleted = true;
    }

    if (status === "pending") {
      filter.isCompleted = false;
    }

    // Sorting
    let sort = {};

    if (sortBy === "dueDate") {
      sort.dueDate = 1;
    } else if (sortBy === "priority") {
      sort.priority = 1;
    } else {
      sort.createdAt = -1;
    }

    const tasks = await Task.find(filter).sort(sort);

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET single task
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// CREATE task
router.post("/", async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// UPDATE task
router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE task
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;