import colors from "colors";

const logger = (req, res, next) => {
  const methodColors = {
    GET: "green",
    POST: "blue",
    PUT: "yellow",
    DELETE: "RED",
  };

  const color = methodColors[req.method] || white;

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      } ${duration} ms`[color]
    );
  });

  next();
};

export default logger;
