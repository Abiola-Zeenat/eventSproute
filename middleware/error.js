const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

export { notFound, errorHandler };
