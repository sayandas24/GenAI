import { sessionModel } from '../models/session.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createSession = asyncHandler(async (req, res) => {
  const { user_id, avatar_id } = req.body;

  if (!user_id || !avatar_id) {
    throw new ApiError(400, "User ID and Avatar ID are required to create a session");
  }

  // Optional: Check if a session already exists between this user and avatar to prevent duplicates
  let session = await sessionModel.findOne({ user_id, avatar_id });

  if (session) {
    return res.status(200).json(new ApiResponse(200, session, "Session already exists, returning existing session"));
  }

  // Create new session
  session = await sessionModel.create({
    user_id,
    avatar_id
  });

  return res.status(201).json(new ApiResponse(201, session, "Session created successfully"));
});

export const getUserSessions = asyncHandler(async (req, res) => {
  // Assuming the user_id is passed as a query param or comes from auth middleware
  const { user_id } = req.query;

  if (!user_id) {
    throw new ApiError(400, "User ID is required to fetch sessions");
  }

  const sessions = await sessionModel.find({ user_id }).populate('avatar_id', 'name avatar_url');

  return res.status(200).json(new ApiResponse(200, sessions, "User sessions fetched successfully"));
});

export const getAllSessions = asyncHandler((async (req, res) => {

  const sessions = await sessionModel.find({})

  return res.status(200).json(new ApiResponse(200, sessions, "All sessions fetched successfully"));

}))