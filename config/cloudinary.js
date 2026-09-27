const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.API_CLOUDNAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

module.exports = cloudinary;