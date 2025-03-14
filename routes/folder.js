const { Router } = require("express");
const { createFolderByUser } = require("../controllers/create.js");
const { readFolderById } = require("../controllers/read.js");
const { updateFolderById } = require("../controllers/update.js");
const { deleteFolderById } = require("../controllers/delete.js");
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

folderRouter.get("/:id/files", async (req, res) => {
  if (!req.user) {
    res.redirect("/log-in");
  }

  const folderId = req.params.id;


});

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




module.exports = folderRouter;
