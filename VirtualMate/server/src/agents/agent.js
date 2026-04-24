import { GoogleGenAI } from '@google/genai'
import { modelInstruction } from '../prompts/mate.prompt.js';
import { chatModel } from '../models/chat.model.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? 'AIzaSyDtVrvnrkCWf6KkxpQgrpi6LhmWpTLDfeU' })

/**
 * Fetches all previous messages from MongoDB and maps them
 * to the format expected by the Gemini Chat API.
 *
 * @returns {Promise<Array<{ role: string, parts: Array<{ text: string }> }>>}
 */
async function buildHistoryFromDB() {
  const messages = await chatModel.find({}).sort({ createdAt: 1 }).lean();

  return messages.map((msg) => ({
    role: msg.role,           // 'user' | 'model' — already matches Gemini's format
    parts: [{ text: msg.content }],
  }));
}

/**
 * Runs the AI agent with full conversation history sourced from the database.
 * Uses the Gemini Chat API (ai.chats.create) for proper multi-turn support.
 *
 * @param {string} userQuery - The latest user message
 * @returns {Promise<string>} - The model's text response
 */
async function agent(userQuery) {
  // 1. Reconstruct history from DB (excludes the current message — it's sent via chat.sendMessage)
  const history = await buildHistoryFromDB();

  // 2. Create a stateful chat session seeded with the full history
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    config: {
      systemInstruction: modelInstruction,
    },
    history,
  });

  // 3. Send the current user message
  const response = await chat.sendMessage({
    message: userQuery,
  });

  return response.text;
}

export default agent;