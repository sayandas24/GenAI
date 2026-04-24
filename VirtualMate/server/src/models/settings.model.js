import mongoose from 'mongoose';

/**
 * Singleton settings document.
 * Only one document ever exists (enforced by the unique `singleton` field).
 */
const settingsSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: 'global',
      unique: true,
      immutable: true,
    },
    geminiApiKey: {
      type: String,
      required: [true, 'Gemini API key is required'],
    },
  },
  { timestamps: true }
);

export const settingsModel = mongoose.model('settings', settingsSchema);
