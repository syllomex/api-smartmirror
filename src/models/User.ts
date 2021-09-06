import mongoose from 'mongoose';

import { User } from './types';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    mirrors: {
      type: mongoose.Types.ObjectId,
      ref: 'mirror',
    },
    googleAccessToken: {
      type: String,
      required: false,
    },
    googleRefreshToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<User>('user', schema);
