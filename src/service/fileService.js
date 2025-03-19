const { uploadToCloudinary } = require("../config/cloudinary.js");
const fs = require("fs");

const cloudinaryUpload = async (file) => {
  try {
    console.log("cloudinaryUploadFile", file);
    const cloudinaryResponse = await uploadToCloudinary(file.path);
    console.log("cloudinaryResponse:", cloudinaryResponse);
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });
    return cloudinaryResponse;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { cloudinaryUpload };
