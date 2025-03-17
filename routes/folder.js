const { Router } = require("express");
const { createFolderByUser, createShareLink } = require("../controllers/create.js");
const { readFolderById } = require("../controllers/read.js");
const { updateFolderById } = require("../controllers/update.js");
const { deleteFolderById } = require("../controllers/delete.js");
const { v4: uuidv4 } = require('uuid');
const folderRouter = Router();


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

  const response = await createFolderByUser(userid, name);

  console.log("response", response);

  return res.redirect("/");
});

folderRouter.get("/:id", async (req, res) => {
  // this is where searching by folder would be handled
  if (!req.user) {
    return res.redirect("/log-in");
  }

  const userId = req.user.id;
  const folderId = req.params.id;

  console.log("id of the user: ", userId);

  if (typeof id === NaN) {
    return res.status(404).render("error", {
      errorMessage: "404: Not found!"
    });
  }

  const folder = await readFolderById(userId, folderId);


  if (folder[0] === undefined) {
    return res.status(403).render("error", {
      errorMessage: "403: Forbidden"
    });

  }

  console.log("folder found was: ", folder[0]);

  // res.render the folder ejs with the folder as the data
  res.render("folder", {
    folder: folder[0]
  });
});

// folderRouter.get("/:id/files", async (req, res) => {
//   if (!req.user) {
//     res.redirect("/log-in");
//   }

//   const folderId = req.params.id;


// });

folderRouter.post("/:id", async (req, res) => {
  const { folderName } = req.body;

  const folderId = req.params.id;

  const response = await updateFolderById(folderId, folderName);

  return res.redirect(`/folder/${folderId}`);
});

folderRouter.get("/add/:id", async (req, res) => {
  res.send("there was a request to upload a file inside of a folder");
  // destructure the folder id, user id and file metadata from form
});

folderRouter.post("/delete/:id", async (req, res) => {
  const folderId = req.params.id;

  try {
    const deleteFolder = await deleteFolderById(folderId);
  } catch (error) {
    console.error(error);
  }

  return res.redirect("/");
});

folderRouter.get("/share/:id", async (req, res) => {
  // check to make sure the req.user has access to this file
  if (!req.user) {
    res.redirect("/log-in");
  }
  const folderId = req.params.id;
  const userId = req.user.id;

  try {
    const response = await readFolderById(userId, folderId);
    
    if(response.length === 0 || response === undefined){
      const msg = "Access denied!";
      res.status(500).render("error", {
        errorMessage: msg,
      });
      throw new Error(msg);
    }

  } catch (error) {
    console.error("Error with matching folder id with user!", error);
  }

  res.render("shareForm", {
    id: folderId,
  });
  // serve form for sharing
  //
});

folderRouter.post("/share/:id", async (req, res) => {
  // create link


  const folderId = req.params.id;
  const { lifeSpan } = req.body;
  const code = uuidv4();
  const link = `/folder/share/${folderId}?access_code=${code}`;
  // add code to db

  try {
    const response = createShareLink(folderId, link, lifeSpan);


  } catch (error) {

  }


  // serve the folder ejs with link passed

});

folderRouter.get("/share/:id", async (req, res) => {
  const folderId = req.params.id;
  const qparams = req.query;

  // pull the code from db for the id, compare to make sure it is correct 
  // if its correct,continue
  // compare timestamp and make sure that its still valid
  // pull data for folderid and serve ejs with data
})



module.exports = folderRouter;
