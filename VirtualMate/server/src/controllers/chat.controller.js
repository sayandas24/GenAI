import runAgent from "../agents/runAgent.js";
import { chatModel } from "../models/chat.model.js";

async function getChats(req, res) {
  try {
    // Sort ascending so the client receives messages in chronological order
    const chats = await chatModel.find({}).sort({ createdAt: 1 }).lean();
    return res.status(200).json({
      message: 'All chats fetched successfully',
      chats,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching chats', error });
  }
}

async function createChats(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    /**
     * IMPORTANT: Run the agent BEFORE saving the user message to the DB.
     *
     * agent.js fetches history from the DB to seed the chat session,
     * then calls chat.sendMessage(userQuery) for the current turn.
     * If we save the user message first, it would appear in the seeded
     * history AND be re-sent — causing the message to be duplicated.
     */
    const aiResponse = await runAgent(message.trim());


    // Persist both turns only after a successful AI response
    await chatModel.create({ content: message.trim(), role: 'user' });
    await chatModel.create({ content: aiResponse, role: 'model' });

    return res.status(201).json({
      message: 'Message saved successfully',
      response: aiResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error processing message', error });
  }
}

async function clearChat(req, res) {
  try {
    await chatModel.deleteMany({})

    return res.status(200).json({ message: 'All chats are cleared' });

  } catch (error) {
    return res.status(500).json({ message: 'Error clearing chats', error });

  }
}

export { getChats, createChats, clearChat };