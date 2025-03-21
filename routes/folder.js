const { Router } = require("express");
const { createFolderByUser, createShareLink } = require("../controllers/create.js");
const { readFolderById, readShareByCode, isOwner } = require("../controllers/read.js");
const { updateFolderById } = require("../controllers/update.js");
const { deleteFolderById } = require("../controllers/delete.js");
const { v4: uuidv4 } = require('uuid');
const folderRouter = Router();
const { shareLinkGenerator } = require("../utils/utils.js");


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
    const authenticated = await isOwner(userId, folderId);

    if (!authenticated) {
      res.status(500).render("error", {
        errorMessage: "User not authenticated",
      });
    }

  } catch (error) {
    console.error("Error with matching folder id with user!", error);
  }

  res.render("shareForm", {
    id: folderId,
  });
  // serve form for sharing
});

folderRouter.post("/share/:id", async (req, res) => {
  // create link

  console.log("greetings from the share generate method")

  const folderId = req.params.id;
  const { lifeSpan } = req.body;
  const code = uuidv4();
  const link = `/folder/share/request/${folderId}?access_code=${code}`;
  // add code to db

  try {
    const response = await createShareLink(folderId, code, lifeSpan);
    console.log("share link response: ", response);
    const domain = req.get('host');
    const url = shareLinkGenerator(domain, link);

    res.send(`shareable link: ${url}`);


  } catch (error) {

    console.error("there was an error with generating the link!", error);
  }


  // serve the folder ejs with link passed

});

folderRouter.get("/share/request/:id", async (req, res) => {
  const folderId = req.params.id;
  const qparams = req.query.access_code;
  let owner = false;




  console.log("the params sent:", qparams);

  try {
    // make sure folder exists
    const response = await readShareByCode(folderId, qparams);
    if (response.length === 0 || response === undefined) {
      res.status(404).render("error", {
        errorMessage: "not found",
      });


    }
    console.log("request to view shared folder response: ", response);

    // check if the request is by the owner of the file
    if(req.user){
      const userOwns = await isOwner(req.user.id, folderId); 
      if(userOwns){
        owner = true;
      }
    }



    // compare time stamps and see if it still

    const shareDate = new Date(response.date_created);
    console.log("share date", shareDate)

    const now = new Date();
    console.log("current date", now);
    const diffInMillinSec = now - shareDate;
    console.log("diffin miili sec: ", diffInMillinSec);
    const diffInDays = Math.floor(diffInMillinSec / (1000 * 60 * 60 * 24));
    console.log("days since share: ", diffInDays);

    const lifeInDays = response.lifespan;
    if(diffInDays > lifeInDays){
      console.log("the share is no longer valid!");
      return;
    } else {
      console.log("the share is still valid!");
    }

    // take the date new Date(db date)
    //
    // now new Date()
    // take difference in millisecionds = now - dbdate
    //
    // convert to days and see if its more than 0 t0 see if there is still time remaining on the lfiespan

    // render page with the folder data
    res.render("folder", {
      folder: response.folder,
    });
  } catch (error) {
    console.error(error);
  }

  // pull the code from db for the id, compare to make sure it is correct 
  // if its correct,continue
  // compare timestamp and make sure that its still valid
  // pull data for folderid and serve ejs with data
});



module.exports = folderRouter;
