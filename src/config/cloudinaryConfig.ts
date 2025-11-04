import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

// Configure Cloudinary
// Trim environment values to avoid issues from accidental whitespace
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : '';
const API_KEY = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : '';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// Basic runtime validation to surface clearer errors when config is missing/wrong
if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Cloudinary configuration problem: one or more CLOUDINARY_* env vars are missing or empty.');
  console.error('Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your .env or environment.');
  console.error(`Current values (masked): cloud_name=${CLOUD_NAME || '<missing>'}, api_key=${API_KEY ? API_KEY.slice(0,4) + '...' : '<missing>'}`);
}

export { cloudinary };