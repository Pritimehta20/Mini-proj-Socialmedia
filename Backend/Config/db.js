import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}
async function dbconnect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        // Don't exit process; let Render try again
    }
}
console.log("Connecting to MongoDB:", process.env.MONGO_URI);

export default dbconnect;