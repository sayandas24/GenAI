import express from 'express'
import cors from 'cors'
import chatRoute from './routes/chat.route.js'
import settingsRoute from './routes/settings.route.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:5174', 'https://virtualmate.vercel.app'],
  credentials: true
}))

app.use(express.json())

app.use('/api/chats', chatRoute)
app.use('/api/settings', settingsRoute)

export default app