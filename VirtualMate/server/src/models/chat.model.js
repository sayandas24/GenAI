import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
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

