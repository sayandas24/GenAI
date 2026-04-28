import express from 'express'
import cors from 'cors'
import chatRoute from './routes/chat.route.js'
import settingsRoute from './routes/settings.route.js'
import { sessionRouter } from './routes/session.routes.js'
import { authRouter } from './routes/user.route.js'
import { avatarRouter } from './routes/avatar.route.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:5174', 'https://virtualmate.vercel.app'],
  credentials: true
}))

app.use(express.json())


app.use('/api/user', authRouter)
app.use('/api/avatar', avatarRouter)
app.use('/api/chats', chatRoute)
app.use('/api/settings', settingsRoute)
app.use('/api/session', sessionRouter)

// Global Error Handler
app.use((err, req, res, next) => {
  // If the error is an instance of our ApiError, use its status code and format
  if (err.name === 'ApiError') {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors
    });
  }

  // Otherwise, it's an unhandled error
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: []
  });
});

export default app