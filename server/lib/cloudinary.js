import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Force environmental parameters to inject inside this file before compiling parameters
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Explicitly export the instance so the configuration bindings are retained
export { cloudinary };
