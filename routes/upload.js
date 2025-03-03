const { Router } = require("express");
const uploadRouter = Router();
const multer = require('multer');
const path = require("path");
const uploadFromStream  = require("../cloud/cloudinary.js");


//under uploading via memory buffer instead of storage config above, all you will need is const storage = multer.memoryStorage(): t
//the file obj will have  a buffer that contains the entire file to pass off somehow to cloudinary. 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

uploadRouter.get("/", (req, res) => {
  if(!req.user){
    return res.redirect("/log-in");
  }

  res.render("upload");
});

uploadRouter.post("/", upload.single("file"), async (req, res) => {
  if(!req.file){
    return res.status(400).json({ message: "no file found!" });
  }
  console.log("file size", req.file.size);
  const uploadResult = await uploadFromStream(req.file.buffer);
  console.log("upload result: ", uploadResult);

  res.status(200).json({ message: "file successfully uploaded", filedata: req.file.filename});
});

module.exports = uploadRouter;
