import mongoose from 'mongoose';

import { Mirror } from './types';

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    code: {
      type: String,
      required: false,
    },
    hash: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<Mirror>('mirror', schema);
