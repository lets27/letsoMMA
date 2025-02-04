import dotenv from "dotenv";
dotenv.config(); // Explicitly load the .env file

import mongoose from "mongoose";
// const password = process.env.dbPassword;

// const dbPort = process.env.dbPort;

const dbURI = process.env.mongoURI;
export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(dbURI);
    console.log("mongo connected", connection.connection.host);
  } catch (error) {
    console.log("failed to connect at errors:", error.message);
    process.exit(1); //error status code
  }
};
