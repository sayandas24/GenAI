import mongoose from 'mongoose'

const avatarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Avatar name is required']
  },
  description: {
    type: String,
    required: [true, 'Avatar description is required']
  },
  /**
   * Corresponds to a key in prompts/registry.js (e.g., "krishna", "buddy").
   * The actual system instruction lives locally in code — NOT in the DB.
   * This keeps prompts version-controlled and avoids DB reads for prompt content.
   */
  prompt_key: {
    type: String,
    required: [true, 'prompt_key is required — it must match a key in prompts/registry.js']
  },
  avatar_url: {
    type: String
  }
},
  { timestamps: true }
)

export const avatarModel = mongoose.model('avatars', avatarSchema)