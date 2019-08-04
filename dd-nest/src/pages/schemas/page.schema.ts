import * as mongoose from 'mongoose';

export const PageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  blocks: [
    {
      type: {
        type: String,
        enum: ['banner', 'products'],
      },
      title: String,
      filter: Object,
    },
  ],
  updatedTime: {
    type: Date,
    required: false,
  },
  createdTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
