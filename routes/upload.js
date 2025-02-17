const { Router } = require("express");
const uploadRouter = Router();
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,"..","uploads"));
  },
  filename: function (req, file, cb) {
    console.log("orginal file name: ", file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, path.basename(file.originalname, path.extname(file.originalname))+ '-' + uniqueSuffix + path.extname(file.originalname));
  }
})

const upload = multer({ storage: storage });

uploadRouter.get("/", (req, res) => {
  if(!req.user){
    return res.redirect("/log-in");
  }

  res.render("upload");
});

uploadRouter.post("/", upload.single("file"), (req, res) => {
  if(!req.file){
    return res.status(400).json({ message: "no file found!" });
  }

  res.status(200).json({ message: "file successfully uploaded", filename: req.file.filename});
});

module.exports = uploadRouter;
