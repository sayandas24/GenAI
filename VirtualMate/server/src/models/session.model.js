import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'User id is required']
  },
  avatar_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'avatars',
    required: [true, 'Avatar id is required']
  }
},
  { timestamps: true }
)

export const sessionModel = mongoose.model('sessions', sessionSchema)