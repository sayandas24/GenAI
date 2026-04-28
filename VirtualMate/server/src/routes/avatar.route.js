import { Router } from 'express'
import { createAvatar, getAvatarById, getAvatars, updateAvatar } from '../controllers/avatar.controller.js'

export const avatarRouter = Router()

avatarRouter.get('/all', getAvatars)
avatarRouter.get('/:id', getAvatarById)

avatarRouter.post('/', createAvatar)
avatarRouter.patch('/:id', updateAvatar)