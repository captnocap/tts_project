import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  token: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});
const UserModel = mongoose.model<IUser>("User", UserSchema);
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = UserModel;

export default User;
