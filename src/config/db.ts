import mongoose from "mongoose";
import logger from "../logger";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI as string;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        const connect = await mongoose.connect(mongoURI);

        logger.info(`Connected to MongoDB: ${connect.connection.host}`);
    } catch (error) {
        logger.error("monogo db connecting error", error);
        return;
    }
};

export default connectDB;