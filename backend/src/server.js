import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import adminRoutes from "./routes/admin.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map(x => x.trim()) : true
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "taskflow-backend" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

connectDatabase()
  .then(() => app.listen(port, () => console.log(`TaskFlow API running on http://localhost:${port}`)))
  .catch((error) => {
    console.error("Database startup failed:", error.message);
    process.exit(1);
  });
