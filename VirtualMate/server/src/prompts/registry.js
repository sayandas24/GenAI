import { defaultInstruction } from './default.prompt.js';
import { rayaInstruction as raya } from './raya.prompt.js';

/**
 * Prompt Registry — maps an avatar's `prompt_key` to its local system instruction.
 *
 * HOW TO ADD A NEW AVATAR PERSONA:
 *   1. Create a new file in /prompts, e.g., `buddy.prompt.js`, and export a const.
 *   2. Import it above.
 *   3. Add a new entry below: { prompt_key: yourImportedConst }
 *
 * The `prompt_key` value stored on the Avatar document in the DB must exactly
 * match the key used here (e.g., avatar.prompt_key === "krishna").
 */
const promptRegistry = {
  raya,
  // buddy,
  // mentor,
  // therapist,
};

/**
 * Looks up the system instruction for a given prompt key.
 * Falls back to the default instruction if the key is not registered.
 *
 * @param {string} promptKey - The key stored on the Avatar document
 * @returns {string} The resolved system instruction
 */
export function resolvePrompt(promptKey) {
  if (!promptKey) return defaultInstruction;
  return promptRegistry[promptKey] ?? defaultInstruction;
}
