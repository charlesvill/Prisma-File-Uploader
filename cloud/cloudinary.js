const { v2 } = require("cloudinary");
const cloudinary = v2;

async function uploadFromStream(buffer) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  console.log("greetings from the buffer stream file uploader!")
  const uploadResult = await new Promise((resolve, reject) => {

    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, uploadResult) => {
        if (error) {
          reject(error);
        } else {
          resolve(uploadResult);
        }
      }).end(buffer);
  });
  console.log("upload successful!", uploadResult.public_id);

  return uploadResult;
}


module.exports = uploadFromStream;

