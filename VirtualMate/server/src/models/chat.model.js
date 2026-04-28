import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sessions',
    required: [true, 'Session ID is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  role: {
    type: String,
    enum: ['user', 'model'],
    required: [true, 'role is required']
  }
}, {
  timestamps: true
})


export const chatModel = mongoose.model('chats', chatSchema)
