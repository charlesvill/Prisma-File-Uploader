const { v2 } = require("cloudinary");
const cloudinary = v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

async function uploadFromStream(buffer) {
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

async function deleteManyFromRemote(files) {
  const response = await cloudinary.api.delete_resources(files).then(result=>console.log(result));
  return response;
}

module.exports = {
  uploadFromStream,
  deleteManyFromRemote,
};

