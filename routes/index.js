const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  console.dir(req.user);
  // use the controller to read all data for user
  res.render("index");
});

module.exports = indexRouter;
