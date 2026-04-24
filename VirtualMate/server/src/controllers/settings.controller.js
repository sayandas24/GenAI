import { settingsModel } from '../models/settings.model.js';

/**
 * The password used to read/write the API key.
 * Change this in .env — never hardcode in production.
 */
const SETTINGS_PASSWORD = process.env.SETTINGS_PASSWORD ?? 'virtualmate2026';

/**
 * GET /api/settings/api-key
 * Body: { password: string }
 *
 * Returns the current Gemini API key if the password is correct.
 */
async function getApiKey(req, res) {
  try {
    const { password } = req.body;

    if (!password || password !== SETTINGS_PASSWORD) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const settings = await settingsModel.findOne({ singleton: 'global' }).lean();

    if (!settings) {
      return res.status(404).json({ message: 'No API key configured yet' });
    }

    return res.status(200).json({ geminiApiKey: settings.geminiApiKey });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch API key', error });
  }
}

/**
 * PUT /api/settings/api-key
 * Body: { password: string, geminiApiKey: string }
 *
 * Creates or replaces the Gemini API key.
 */
async function updateApiKey(req, res) {
  try {
    const { password, geminiApiKey } = req.body;

    if (!password || password !== SETTINGS_PASSWORD) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (!geminiApiKey || typeof geminiApiKey !== 'string' || !geminiApiKey.trim()) {
      return res.status(400).json({ message: 'A valid API key is required' });
    }

    // Upsert — creates if not exists, updates if exists
    await settingsModel.findOneAndUpdate(
      { singleton: 'global' },
      { geminiApiKey: geminiApiKey.trim() },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return res.status(200).json({ message: 'API key updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update API key', error });
  }
}

export { getApiKey, updateApiKey };
