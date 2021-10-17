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
    widgets: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

const MirrorModel = mongoose.model<Mirror>('mirror', schema);

export default MirrorModel;
