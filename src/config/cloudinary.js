const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
require("dotenv").config();

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

//This is a function that generates a signature.
//An object containing parameters that need to be signed (e.g., upload settings). -paramsToSign
const generateSignature = (paramsToSign) => {
  //Cloudinary API uses a secret key (api_secret) to generate secure signatures.
  //cloudinary.config() retrieves Cloudinary's configuration, and api_secret is extracted.
  const { api_secret } = cloudinary.config();
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1") // hashing algo
    .update(sortedParams + api_secret)
    .digest("hex"); //digest method generates final hashed output in hexadecimal format

  return signature;
};
const uploadToCloudinary = async (filePath) => {
  try {
    cloudinaryConfig();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
    };
    //it will make sure that uploads are authentic to cloudinary
    const signature = generateSignature(paramsToSign);
    const result = await cloudinary.uploader.upload(filePath, {
      ...paramsToSign,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
    console.log("result:", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { uploadToCloudinary };
