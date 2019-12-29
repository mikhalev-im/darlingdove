import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  postalCode: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedTime: {
    type: Date,
  },
  isAdmin: {
    type: Boolean,
  },
});

UserSchema.set('toObject', {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});
