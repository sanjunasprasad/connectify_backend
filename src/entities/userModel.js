import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
    required: true,
  },
  isAdmin: { type: Boolean, default: false } ,
  image: {
    type: String,
    // default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reports: [
    {
      reportedBy: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
