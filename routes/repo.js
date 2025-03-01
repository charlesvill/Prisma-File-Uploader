const { Router } = require("express");
const repoRouter = Router();
const path = require('path');
const fs = require('fs');
const uploadsPath = path.join(__dirname, 'uploads');

repoRouter.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadsPath, filename);
  console.log("desired folder filepath: ", filepath);



  // check to make sure that it exists

});



module.exports = repoRouter;
