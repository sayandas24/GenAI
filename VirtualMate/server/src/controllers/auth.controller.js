import { userModel } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {

  const { username, email } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username and email is required");
  }

  // Check if user already exists
  const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User with this email is already exist");
  }

  const newUser = await userModel.create({
    username,
    email
  });

  return res.status(201).json(new ApiResponse(201, { data: newUser }, "User created successfully"));


})

export const getUser = asyncHandler(async (req, res) => {
  // Depending on your auth setup, this might come from a token/session (e.g., req.user.email)
  // For now, accepting it from req.query or req.body for flexibility
  const email = req.query.email || req.body.email;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  return res.status(201).json(new ApiResponse(201, user, "User fetched successfully"));
})

export const getAllUsers = asyncHandler(async (req, res) => {

  const user = await userModel.find({});

  return res.status(200).json(new ApiResponse(200, user, "All users fetched successfully"));
})