const { Router } = require("express");
const fileRouter = Router();
const { readFileById } = require("../controllers/read");
const axios = require("axios");

fileRouter.get("/:id", async (req, res) => {
  if (!req.user) {
    res.redirect("/log-in");
  }

  const fileId = req.params.id;
  const response = await readFileById(fileId, req.user.id).catch((error) => {
    res.status(500).render("error", {
      errorMessage: error,
    });
  });

  console.log("File read response: ", response);

  const previewableExt = [
    "img",
    "png",
    "svg",
    "jpeg",
    "jpg",
  ];

  const file = { ...response, previewableExt };

  res.render("file", {

    file: file,
  });

});

fileRouter.get("/download/:id", async (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;

  const fileData = await readFileById(fileId, userId);

  console.log("file data: ", fileData);

  const fileUrl = fileData.file_url;
  console.log("fileUrl: ", fileUrl);

  try {
    const response = await axios.get(fileUrl, { responseType: "stream" });

    res.setHeader('Content-Disposition', `attachment; filename="${fileData.file_name}"`);
    res.setHeader('Content-Type', response.headers['content-type']);

    // Stream the file to the response
    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file: ', error);
    res.redirect(`file/${fileId}`);
  }

});

module.exports = fileRouter;
