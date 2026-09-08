import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "../src/config/db.js";
import authRoutes from "../src/routes/auth.js";
import taskRoutes from "../src/routes/tasks.js";
import adminRoutes from "../src/routes/admin.js";
import { notFound, errorHandler } from "../src/middleware/error.js";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

let databasePromise;
app.use(async (req, res, next) => {
  try {
    if (!databasePromise) {
      databasePromise = connectDatabase().catch((error) => {
        databasePromise = undefined;
        throw error;
      });
    }
    await databasePromise;
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "taskflow-backend" })
);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
