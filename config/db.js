import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {

        console.log("DB variable loaded:", Boolean(process.env.db_connection_string));

        await mongoose.connect(process.env.db_connection_string);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;