import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// const URI = "mongodb://127.0.0.1:27017/personal-finance-tracker"
// mongoose.connect(URI);

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Database connection Successfull");
    } catch (error) {
        console.error("Database connection failed");
        process.exit(0);
    }
}

export default connectDb;
