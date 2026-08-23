export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  void next;

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((entry) => entry.message)
      .join(" ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${error.path}.`;
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "A record with that value already exists.";
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({ message });
}
