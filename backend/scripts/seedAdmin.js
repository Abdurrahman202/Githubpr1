import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../src/config/db.js";
import { User } from "../src/models/User.js";

await connectDatabase();

const name = process.env.ADMIN_NAME || "TaskFlow Admin";
const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 8) {
  throw new Error("Set ADMIN_PASSWORD in .env and make it at least 8 characters.");
}

const passwordHash = await bcrypt.hash(password, 12);
const existing = await User.findOne({ email }).select("+passwordHash");
if (existing) {
  existing.name = name;
  existing.passwordHash = passwordHash;
  existing.role = "admin";
  await existing.save();
  console.log(`Updated administrator: ${email}`);
} else {
  await User.create({ name, email, passwordHash, role: "admin" });
  console.log(`Created administrator: ${email}`);
}

process.exit(0);
