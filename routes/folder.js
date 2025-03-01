const { Router } = require("express");
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


  const response = await prisma.folder.create({
    data: {
      folder_name: name,
      owner: {
        connect: {
          id: Number(userid)
        },
      },
    },
    include: {
      owner: {
        include: {
          folders: true,
        },
      },
    },
  });
  
  console.log("response", response);
  // const clearDbase = await prisma.folder.deleteMany({
  //   where: {
  //     ownerId : Number(userid),
  //   },
  // });

  return res.redirect("/");
});

folderRouter.get("/:id", (req, res) => {
  // this is where searching by folder would be handled
  res.send("we are in the folder id route");
});

folderRouter.get("/", (req, res) => {
  console.log("not found");

  res.send("we are in the folder router");
  // return res.redirect("/");
});


module.exports = folderRouter;
