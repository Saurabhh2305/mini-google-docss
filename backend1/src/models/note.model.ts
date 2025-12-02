import mongoose, { Document, Schema, Types } from "mongoose";

export type CollaboratorRole = "viewer" | "editor";

export interface ICollaborator {
  user: Types.ObjectId;
  role: CollaboratorRole;
}

export interface IVersion {
  content: string;
  updatedAt: Date;
}

export interface INote extends Document {
  title: string;
  content: string;
  owner: Types.ObjectId;
  collaborators: ICollaborator[];
  versions: IVersion[];
}

const collaboratorSchema = new Schema<ICollaborator>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["viewer", "editor"], default: "editor" }
  },
  { _id: false }
);

const versionSchema = new Schema<IVersion>(
  {
    content: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [collaboratorSchema],
    versions: [versionSchema]
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", noteSchema);
