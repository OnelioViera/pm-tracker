import mongoose, { Schema, model, models } from 'mongoose';

export interface IWork {
  _id?: string;
  title: string;
  description?: string;
  projectManagerId: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkSchema = new Schema<IWork>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    projectManagerId: {
      type: String,
      required: [true, 'Project Manager ID is required'],
      ref: 'ProjectManager',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Work = models.Work || model<IWork>('Work', WorkSchema);

export default Work;
