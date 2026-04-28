import { Router } from "express";
import { clearAllChats, clearChat, createChat, getChats } from "../controllers/chat.controller.js";

const chatRoute = Router()

chatRoute.get('/', getChats)
chatRoute.post('/', createChat)


chatRoute.delete('/clear/user', clearChat)
chatRoute.delete('/clear/all', clearAllChats)

export default chatRoute