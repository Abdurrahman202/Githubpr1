export function notFound(req, res) {
  res.status(404).json({ message: "Route not found." });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.code === 11000) return res.status(409).json({ message: "That email is already registered." });
  if (err?.name === "ValidationError") return res.status(400).json({ message: "Invalid data provided.", details: err.message });
  res.status(500).json({ message: "Something went wrong on the server." });
}
