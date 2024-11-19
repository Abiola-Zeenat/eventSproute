import express from "express";
import connectDB from "./config/db.js";
import colors from "colors";

const app = express();

connectDB();

const port = process.env.PORT || 3030;

app.listen(port, () =>
  console.log(colors.green(`evensproute listening on port ${port}`))
);
