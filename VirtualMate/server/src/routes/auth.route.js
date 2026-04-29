import { Router } from 'express'
import { authenticateUser, getAllUsers, getUser } from '../controllers/auth.controller.js'

export const authRouter = Router()

authRouter.get('/me', getUser)
authRouter.get('/all', getAllUsers)

authRouter.post('/', authenticateUser)

