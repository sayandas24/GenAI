import { userModel } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { adminAuth } from '../utils/firebase.js';

export const authenticateUser = asyncHandler(async (req, res) => {
  const { username, token } = req.body;

  if (!token) {
    throw new ApiError(400, "Authentication token is required");
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const { uid, email } = decodedToken;

  if (!email) {
    throw new ApiError(400, "Email not provided by authentication provider");
  }

  // Check if user already exists using the Firebase UID
  let user = await userModel.findById(uid);

  if (user) {
    return res.status(200).json(new ApiResponse(200, { data: user }, "User already exist returning the user"));
  }

  // Fallback: check if user exists by email (in case they were created before we linked the UID)
  user = await userModel.findOne({ email });
  if (user) {
    // If we wanted to, we could update the user's _id here, but changing _id in MongoDB is not possible.
    // So we just return the user as is.
    return res.status(200).json(new ApiResponse(200, { data: user }, "User found by email"));
  }

  // Create a new user with _id matching the Firebase UID
  const newUser = await userModel.create({
    _id: uid,
    username: username || email.split("@")[0] || "User",
    email
  });

  return res.status(201).json(new ApiResponse(201, { data: newUser }, "User created successfully"));
});

export const getUser = asyncHandler(async (req, res) => {
  const id = req.query.id || req.body.id || req.query.uid || req.body.uid || req.query.email || req.body.email;

  if (!id) {
    throw new ApiError(400, "User ID or Email is required");
  }

  let user = await userModel.findById(id);
  
  if (!user) {
    user = await userModel.findOne({ email: id });
  }

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
})

export const getAllUsers = asyncHandler(async (req, res) => {

  const user = await userModel.find({});

  return res.status(200).json(new ApiResponse(200, user, "All users fetched successfully"));
})