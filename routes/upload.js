const { Router } = require("express");
const uploadRouter = Router();
const multer = require('multer');
const path = require("path");
const { uploadFromStream } = require("../cloud/cloudinary.js");
const { createFileByUser } = require("../controllers/create.js");


//under uploading via memory buffer instead of storage config above, all you will need is const storage = multer.memoryStorage(): t
//the file obj will have  a buffer that contains the entire file to pass off somehow to cloudinary. 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

uploadRouter.get("/:folderId", (req, res) => {
  if(!req.user){
    return res.redirect("/log-in");
  }

  const folderId = req.params.folderId;

  res.render("upload", {
    folderId: folderId
  });
});

uploadRouter.post("/:folderId", upload.single("file"), async (req, res) => {
  if(!req.file){
    return res.status(400).json({ message: "no file found!" });
  }
  const folderId = req.params.folderId;
  const fileExt = path.extname(req.file.originalname).slice(1);

  const uploadResult = await uploadFromStream(req.file.buffer);
   
  console.log("req file object", req.file);
  console.log("upload result: ", uploadResult);

  const dbResponse = await createFileByUser(
    req.file.originalname,
    fileExt,
    req.file.size,
    uploadResult.url,
    uploadResult.public_id,
    req.user.id,
    folderId
  );

  console.log("file upload response: ", dbResponse);

  res.status(200).redirect(`/folder/${folderId}`);
});

module.exports = uploadRouter;
