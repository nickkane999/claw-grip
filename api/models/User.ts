import mongoose, { Schema, Document } from "mongoose";

export interface User {
  username: string;
  password: string;
  email: string;
  createdDate: string;
  updatedDate: string;
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    createdDate: { type: String, required: true },
    updatedDate: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<User>("User", UserSchema);
