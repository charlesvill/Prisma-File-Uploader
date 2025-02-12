const { Router } = require("express");

const logInRouter = Router();


logInRouter.get("/", (req, res) => {
  res.render("login");
});

logInRouter.post("/", async(req, res) => {
  // authenticate
});


module.exports = logInRouter;
