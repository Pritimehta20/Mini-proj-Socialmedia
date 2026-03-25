import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}
async function dbconnect(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected DB")
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}
console.log("Connecting to MongoDB:", process.env.MONGO_URI);

export default dbconnect;