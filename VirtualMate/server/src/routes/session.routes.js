import { Router } from "express";
import { createSession, getAllSessions, getUserSessions } from "../controllers/session.controller.js";

export const sessionRouter = Router()

sessionRouter.get('/all', getAllSessions)
sessionRouter.get('/user', getUserSessions)

sessionRouter.post('/', createSession)