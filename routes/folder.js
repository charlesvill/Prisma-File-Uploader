const { Router } = require("express");
const { createFolderByUser } = require("../controllers/create.js");
const { readFolderById } = require("../controllers/read.js");
const folderRouter = Router();

const prisma = require("../prisma/prisma.js");


folderRouter.get("/create", (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }

  console.log("create folder form should served");

  res.render("addForm", {
    user: req.user
  });
});

folderRouter.post("/create", async (req, res) => {
  const { name, userid } = req.body;

  const response = await createFolderByUser(userid);
  
  console.log("response", response);
  // const clearDbase = await prisma.folder.deleteMany({
  //   where: {
  //     ownerId : Number(userid),
  //   },
  // });

  return res.redirect("/");
});

folderRouter.get("/:id", async (req, res) => {
  // this is where searching by folder would be handled
  if(!req.user){
    return res.redirect("/log-in");
  }

  const userId = req.user.id;
  const folderId = req.params.id;

  console.log("id of the user: ", userId);

  if(typeof id === NaN ){
    return res.status(404).render("error", {
      errorMessage: "404: Not found!"
    });
  }

  const  folder  = await readFolderById(userId, folderId);


  if(folder[0] === undefined){
    return res.status(403).render("error",{
      errorMessage: "403: Forbidden"
    });

  }

  console.log("folder found was: ", folder[0]);

  // res.render the folder ejs with the folder as the data
  



  res.send("we are in the folder id route");
});


module.exports = folderRouter;
