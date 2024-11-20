import express from "express";
import connectDB from "./config/db.js";
import colors from "colors";
import authRouter from "./Routes/auth.js";
import userRouter from "./Routes/user.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// database
connectDB();

const port = process.env.PORT || 3030;

app.listen(port, () =>
  console.log(colors.green(`evensproute listening on port ${port}`))
);
