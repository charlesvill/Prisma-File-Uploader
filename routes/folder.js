const { Router } = require("express");
const folderRouter = Router();

const prisma = require("../prisma/prisma.js");

folderRouter.get("/:id", (req, res) => {
  // this is where searching by folder would be handled
});

folderRouter.get("/create", (req, res) => {
  if(!req.user){
    return res.redirect("/log-in");
  }
  res.render("addForm", {
    user: req.user
  });
});

folderRouter.post("/create", async (req, res) => {
  const { name, userid } = req.body;


  const response = await prisma.folder.create({
    data: {
      folder_name: name,
      owner : {
        connect: {
          where: {
            id: userid
          },
        },
      },
    },
    include: {
      owner: true,
    }
  });

  console.dir(response);

  return res.json(response);
  // async function that creates folder with name 
})
