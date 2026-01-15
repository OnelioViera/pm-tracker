import mongoose, { Schema, model, models } from 'mongoose';

export interface IProjectManager {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectManagerSchema = new Schema<IProjectManager>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectManager = models.ProjectManager || model<IProjectManager>('ProjectManager', ProjectManagerSchema);

export default ProjectManager;
