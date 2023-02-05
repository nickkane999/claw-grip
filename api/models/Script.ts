import mongoose, { Schema, Document } from "mongoose";

export interface Script {
  name: string;
  script: string;
  createdAt: string;
  updatedAt: string;
  user: string;
}

export interface ScriptsModel extends Script, Document {}

const ScriptsSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    script: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { versionKey: false }
);

export default mongoose.model<Script>("Script", ScriptsSchema);
