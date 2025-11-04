// Simple Cloudinary credentials test script
// Usage: node ./scripts/testCloudinary.js
const { config } = require('dotenv');
config();
const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : '';
const API_KEY = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : '';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

console.log('Testing Cloudinary credentials (masked):', {
  cloud_name: CLOUD_NAME || '<missing>',
  api_key: API_KEY ? API_KEY.slice(0, 6) + '...' : '<missing>'
});

cloudinary.api.resources({ max_results: 1 }, (error, result) => {
  if (error) {
    console.error('Cloudinary test error:');
    console.error(error);
    process.exit(1);
  }

  console.log('Cloudinary test success: got resources');
  console.log(result && result.resources ? `resources_count=${result.resources.length}` : result);
  process.exit(0);
});
