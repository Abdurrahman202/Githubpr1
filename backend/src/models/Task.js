import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    status: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

taskSchema.index({ creator: 1, createdAt: -1 });
taskSchema.index({ assignee: 1, createdAt: -1 });

export const Task = mongoose.model("Task", taskSchema);
