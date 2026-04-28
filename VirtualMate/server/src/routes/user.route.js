import { Router } from 'express'
import { createUser, getAllUsers, getUser } from '../controllers/auth.controller.js'

export const authRouter = Router()

authRouter.get('/me', getUser)
authRouter.get('/all', getAllUsers)

authRouter.post('/', createUser)

