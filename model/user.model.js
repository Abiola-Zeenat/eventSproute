import { model, Schema } from "mongoose";

const UserSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "admin", "organiser"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);

export default User;
