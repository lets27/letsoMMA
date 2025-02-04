import mongoose from "mongoose";

const RegularUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

//create the RegularUser model
const RegularUser = mongoose.model("RegularUser", RegularUserSchema);
export default RegularUser;
