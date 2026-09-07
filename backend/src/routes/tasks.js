import express from "express";
import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const STATUSES = ["todo", "doing", "done"];

function validObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const filter = req.user.role === "admin"
      ? {}
      : { $or: [{ creator: req.user._id }, { assignee: req.user._id }] };

    const tasks = await Task.find(filter)
      .populate("creator", "name email")
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description = "", status = "todo", assigneeId = null } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Task title is required." });
    if (!STATUSES.includes(status)) return res.status(400).json({ message: "Invalid task status." });

    let assignee = null;
    if (assigneeId) {
      if (!validObjectId(assigneeId)) return res.status(400).json({ message: "Invalid assignee." });
      if (req.user.role !== "admin" && assigneeId !== req.user._id.toString()) {
        return res.status(403).json({ message: "Normal users can only assign a task to themselves." });
      }
      const target = await User.findById(assigneeId).select("_id role");
      if (!target) return res.status(404).json({ message: "Assignee not found." });
      assignee = target._id;
    }

    const task = await Task.create({
      title: title.trim(),
      description: String(description).trim(),
      status,
      creator: req.user._id,
      assignee
    });

    const populated = await task.populate([
      { path: "creator", select: "name email" },
      { path: "assignee", select: "name email" }
    ]);
    res.status(201).json({ task: populated });
  } catch (err) { next(err); }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!validObjectId(id)) return res.status(400).json({ message: "Invalid task id." });
    if (!STATUSES.includes(status)) return res.status(400).json({ message: "Invalid task status." });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    const canEdit = req.user.role === "admin" || task.creator.equals(req.user._id) || task.assignee?.equals(req.user._id);
    if (!canEdit) return res.status(403).json({ message: "You do not have permission to update this task." });

    task.status = status;
    await task.save();
    const populated = await task.populate([
      { path: "creator", select: "name email" },
      { path: "assignee", select: "name email" }
    ]);
    res.json({ task: populated });
  } catch (err) { next(err); }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validObjectId(id)) return res.status(400).json({ message: "Invalid task id." });
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const canEdit = req.user.role === "admin" || task.creator.equals(req.user._id);
    if (!canEdit) return res.status(403).json({ message: "Only the creator or an administrator can edit this task." });

    const { title, description, status, assigneeId } = req.body;
    if (title !== undefined) task.title = String(title).trim();
    if (description !== undefined) task.description = String(description).trim();
    if (status !== undefined) {
      if (!STATUSES.includes(status)) return res.status(400).json({ message: "Invalid task status." });
      task.status = status;
    }
    if (assigneeId !== undefined) {
      if (assigneeId === null || assigneeId === "") {
        task.assignee = null;
      } else {
        if (!validObjectId(assigneeId)) return res.status(400).json({ message: "Invalid assignee." });
        if (req.user.role !== "admin" && assigneeId !== req.user._id.toString()) {
          return res.status(403).json({ message: "Normal users can only assign a task to themselves." });
        }
        const target = await User.findById(assigneeId).select("_id");
        if (!target) return res.status(404).json({ message: "Assignee not found." });
        task.assignee = target._id;
      }
    }

    await task.save();
    const populated = await task.populate([
      { path: "creator", select: "name email" },
      { path: "assignee", select: "name email" }
    ]);
    res.json({ task: populated });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    const canDelete = req.user.role === "admin" || task.creator.equals(req.user._id);
    if (!canDelete) return res.status(403).json({ message: "Only the creator or an administrator can delete this task." });
    await task.deleteOne();
    res.json({ message: "Task deleted." });
  } catch (err) { next(err); }
});

router.patch("/:id/assign", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assigneeId = null } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    if (assigneeId === null || assigneeId === "") {
      task.assignee = null;
    } else {
      if (!validObjectId(assigneeId)) return res.status(400).json({ message: "Invalid assignee." });
      const target = await User.findById(assigneeId).select("_id role");
      if (!target) return res.status(404).json({ message: "User not found." });
      if (target.role === "admin") return res.status(400).json({ message: "Tasks should be assigned to normal users." });
      task.assignee = target._id;
    }

    await task.save();
    const populated = await task.populate([
      { path: "creator", select: "name email" },
      { path: "assignee", select: "name email" }
    ]);
    res.json({ task: populated });
  } catch (err) { next(err); }
});

export default router;
