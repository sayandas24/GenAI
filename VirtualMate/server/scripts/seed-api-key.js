/**
 * One-time seed script — inserts the initial Gemini API key into the DB.
 * Run with: node scripts/seed-api-key.js
 * Safe to run multiple times (upserts, won't duplicate).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { settingsModel } from '../src/models/settings.model.js';

const GEMINI_API_KEY = 'AIzaSyDtVrvnrkCWf6KkxpQgrpi6LhmWpTLDfeU';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB ✓');

  await settingsModel.findOneAndUpdate(
    { singleton: 'global' },
    { geminiApiKey: GEMINI_API_KEY },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('✓ API key seeded successfully');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
