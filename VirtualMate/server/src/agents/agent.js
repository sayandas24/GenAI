import { GoogleGenAI } from '@google/genai'
import { chatModel } from '../models/chat.model.js';
import { settingsModel } from '../models/settings.model.js';
import { sessionModel } from '../models/session.model.js';
import { resolvePrompt } from '../prompts/registry.js';

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
 * Resolves the correct system instruction for a session.
 *
 * Flow: session_id → Session doc → avatar.prompt_key → local registry → systemInstruction
 *
 * Prompts are stored locally in /prompts/*.prompt.js files and referenced via registry.js.
 * Only the lightweight `prompt_key` string is stored in the DB on the Avatar document.
 *
 * @param {string} session_id
 * @returns {Promise<string>} The resolved system instruction string
 */
async function resolveSystemInstruction(session_id) {
  if (!session_id) return resolvePrompt(null);

  const session = await sessionModel
    .findById(session_id)
    .populate('avatar_id', 'prompt_key')  // Only fetch the key, not the entire avatar doc
    .lean();

  const promptKey = session?.avatar_id?.prompt_key;
  return resolvePrompt(promptKey);
}

/**
 * Fetches previous messages for a specific session from MongoDB
 * and maps them to the format expected by the Gemini Chat API.
 *
 * @param {string} session_id
 * @returns {Promise<Array>} Gemini-formatted chat history
 */
async function buildHistoryFromDB(session_id) {
  const query = session_id ? { session_id } : {};
  const messages = await chatModel.find(query).sort({ createdAt: 1 }).lean();

  return messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));
}

/**
 * Runs the AI agent for a specific session.
 * - System instruction resolved from local registry (zero extra DB read for prompt content).
 * - Chat history scoped to this session only.
 * - API key always fetched fresh so key changes take effect instantly.
 *
 * @param {string} userQuery - The user's message
 * @param {string} session_id - Ties user + avatar together
 * @returns {Promise<string>} The AI's text response
 */
async function agent(userQuery, session_id) {
  const [apiKey, systemInstruction, history] = await Promise.all([
    resolveApiKey(),
    resolveSystemInstruction(session_id),
    buildHistoryFromDB(session_id),
  ]);

  const ai = new GoogleGenAI({ apiKey });

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    config: { systemInstruction },
    history,
  });

  const response = await chat.sendMessage({ message: userQuery });

  return response.text;
}

export default agent;