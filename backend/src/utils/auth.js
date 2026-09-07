import jwt from "jsonwebtoken";

export function createToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in the environment.");
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}
