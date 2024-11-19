import mongoose from "mongoose";
import colors from "colors";

const url = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(
      colors.black.bgWhite.italic(
        `Database Connected 🌎: ${conn.connection.host}`
      )
    );
  } catch (err) {
    console.error(colors.red(`Mongodb Failed to connect: ${err.message}`));
    process.exit(1);
  }
};

export default connectDB;
