import express from "express";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("name email role createdAt").sort({ createdAt: -1 });
    const counts = await Task.aggregate([
      { $group: { _id: "$assignee", count: { $sum: 1 } } }
    ]);
    const countMap = new Map(counts.filter(x => x._id).map(x => [x._id.toString(), x.count]));
    res.json({ users: users.map(user => ({
      id: user._id, name: user.name, email: user.email, role: user.role,
      taskCount: countMap.get(user._id.toString()) || 0, createdAt: user.createdAt
    })) });
  } catch (err) { next(err); }
});

router.get("/stats", async (req, res, next) => {
  try {
    const [totalUsers, totalTasks, unassigned, doing, done] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Task.countDocuments(),
      Task.countDocuments({ assignee: null }),
      Task.countDocuments({ status: "doing" }),
      Task.countDocuments({ status: "done" })
    ]);
    res.json({ totalUsers, totalTasks, unassigned, doing, done });
  } catch (err) { next(err); }
});

export default router;
