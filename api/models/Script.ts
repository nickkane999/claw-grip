import mongoose, { Schema, Document } from "mongoose";

export interface Script {
  name: string;
  script: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptsModel extends Script, Document {}

const ScriptsSchema: Schema = new Schema(
  { name: { type: String, required: true }, script: { type: String, required: true }, createdAt: { type: String, required: true }, updatedAt: { type: String, required: true } },
  { versionKey: false }
);

export default mongoose.model<Script>("Scripts", ScriptsSchema);
