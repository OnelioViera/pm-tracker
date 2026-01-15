import mongoose, { Schema, model, models } from 'mongoose';

export interface IJob {
  _id?: string;
  title: string;
  description?: string;
  projectManagerId: string;
  status: 'active' | 'on-hold' | 'completed' | 'cancelled';
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const JobSchema = new Schema<IJob>(
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
      enum: ['active', 'on-hold', 'completed', 'cancelled'],
      default: 'active',
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Job = models.Job || model<IJob>('Job', JobSchema);

export default Job;
