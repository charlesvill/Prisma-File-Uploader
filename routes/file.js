const { Router } = require("express");
const fileRouter = Router();
const { readFileById } = require("../controllers/read");
fileRouter.get("/:id", async (req, res) => {
  if (!req.user) {
    res.redirect("/log-in");
  }

  const fileId = req.params.id;

  try {
    const response = await readFileById(fileId, req.user.id);
    console.log("File read response: ", response);
  } catch (error) { res.status(500).render("error", {
      errorMessage: error,
    });
  }

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
