import 'dotenv/config'
import app from "./src/app.js";
import connectDB from './src/db/connect.db.js';

const PORT = process.env.PORT ?? '4000'

connectDB()

app.listen(PORT, () => {
  console.log(`✓ listening to: http://locahost:${PORT}`)
})

app.get('/health', (req, res) => {
  res.send('Server is running and Healthy')
})

export default app