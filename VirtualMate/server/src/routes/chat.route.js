import { Router } from "express";
import { clearChat, createChats, getChats } from "../controllers/chat.controller.js";

const chatRoute = Router()

chatRoute.get('/', getChats)
chatRoute.post('/', createChats)
chatRoute.delete('/delete/all', clearChat)

export default chatRoute