import mongoose, { Schema, Document } from "mongoose";

export interface User {
  name: string;
  password: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<User>("User", UserSchema);
