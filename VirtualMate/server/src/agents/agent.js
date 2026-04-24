import { GoogleGenAI } from '@google/genai'
import { modelInstruction } from '../prompts/mate.prompt.js';
import { chatModel } from '../models/chat.model.js';
import { settingsModel } from '../models/settings.model.js';

/**
 * Resolves the Gemini API key exclusively from the database.
 * Throws a clear error if no key has been configured via the Settings page.
 */
async function resolveApiKey() {
  const settings = await settingsModel.findOne({ singleton: 'global' }).lean();

  if (!settings?.geminiApiKey) {
    throw new Error(
      'No Gemini API key configured. Go to Settings → API Key and add one.'
    );
  }

  return settings.geminiApiKey;
}

/**
 * Fetches all previous messages from MongoDB and maps them
 * to the format expected by the Gemini Chat API.
 */
async function buildHistoryFromDB() {
  const messages = await chatModel.find({}).sort({ createdAt: 1 }).lean();

  return messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));
}

/**
 * Runs the AI agent with full conversation history sourced from the database.
 * Fetches the API key from the DB on every call so key changes take effect instantly.
 */
async function agent(userQuery) {
  const [apiKey, history] = await Promise.all([
    resolveApiKey(),
    buildHistoryFromDB(),
  ]);

  const ai = new GoogleGenAI({ apiKey });

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    config: { systemInstruction: modelInstruction },
    history,
  });

  const response = await chat.sendMessage({ message: userQuery });

  return response.text;
}

export default agent;