const { Router } = require("express");
const { readAllFoldersByUser } = require("../controllers/read.js");
const indexRouter = Router();


indexRouter.get("/", async (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  // use the controller to read all data for user
  const  folders  = await readAllFoldersByUser(req.user);
  
  console.log("folders", folders);
  res.render("index", {
    folders: folders,
  });
});

module.exports = indexRouter;
