import mongoose from "mongoose"

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`Connected to database ✓`)
  } catch (error) {
    console.error(`Error connecting with the DB`, error)
  }
}

export default connectDB