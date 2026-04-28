import agent from "../agents/agent.js";
import runAgent from "../agents/runAgent.js";
import { chatModel } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createChat = asyncHandler(async (req, res) => {

  const { content, session_id } = req.body

  if (!content || !session_id) {
    throw new ApiError(400, 'session id and content is required')
  }

  // Passing session_id so runAgent can load history and system prompt for this specific session
  const aiResponse = await runAgent(content, session_id)
  console.log(aiResponse, "ai response received")

  await chatModel.create({ content, role: "user", session_id })
  const newChat = await chatModel.create({ content: aiResponse, role: "model", session_id })

  return res.status(201).json(new ApiResponse(201, { chat: newChat }, "Chat created successfully"));
})

const getChats = asyncHandler(async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    throw new ApiError(400, 'session id is required as a query parameter to fetch chats');
  }

  // Sort ascending so the client receives messages in chronological order
  const chats = await chatModel.find({ session_id }).sort({ createdAt: 1 }).lean();

  return res.status(200).json(new ApiResponse(200, chats, 'Chats fetched successfully'));
})

const clearChat = asyncHandler(async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    throw new ApiError(400, 'session id is required as a query parameter to clear chats');
  }

  // Only delete chats that belong to this specific session!
  await chatModel.deleteMany({ session_id });

  return res.status(200).json(new ApiResponse(200, null, 'Chats for this session cleared successfully'));
})

const clearAllChats = asyncHandler(async (req, res) => {

  // Only delete chats that belong to this specific session!
  await chatModel.deleteMany()

  return res.status(200).json(new ApiResponse(200, null, 'All chats has been cleared'));
})

export { getChats, createChat, clearChat, clearAllChats };