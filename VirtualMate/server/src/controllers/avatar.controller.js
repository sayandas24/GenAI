import { avatarModel } from '../models/avatar.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createAvatar = asyncHandler(async (req, res) => {
  const { name, description, prompt_key, avatar_url } = req.body;

  // prompt_key must match a registered key in prompts/registry.js (e.g., "krishna")
  if (!name || !description || !prompt_key) {
    throw new ApiError(400, 'Name, description, and prompt_key are required');
  }

  // find if the same avatar is present 
  const existingAvatar = await avatarModel.findOne({
    $or: [
      { name },
      { prompt_key }
    ]
  })
  if (existingAvatar) {
    throw new ApiError(400, 'This character is already present in the db');
  }

  const newAvatar = await avatarModel.create({
    name,
    description,
    prompt_key,
    avatar_url
  });

  return res.status(201).json(new ApiResponse(201, newAvatar, "Avatar created successfully"));
});

export const getAvatars = asyncHandler(async (req, res) => {
  const avatars = await avatarModel.find();
  return res.status(200).json(new ApiResponse(200, avatars, "Avatars fetched successfully"));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id) {
    throw new ApiError(400, 'Avatar ID is required in the URL');
  }

  // Find and update the avatar.
  const updatedAvatar = await avatarModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });

  if (!updatedAvatar) {
    throw new ApiError(404, 'Avatar not found');
  }

  return res.status(200).json(new ApiResponse(200, updatedAvatar, "Avatar updated successfully"));
});

export const getAvatarById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'Avatar id is required');
  }

  const avatar = await avatarModel.findById(id);

  if (!avatar) {
    throw new ApiError(404, 'Avatar not found');
  }

  return res.status(200).json(new ApiResponse(200, avatar, "Avatar fetched successfully"));
});