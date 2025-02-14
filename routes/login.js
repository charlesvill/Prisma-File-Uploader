const { Router } = require("express");
const passport = require("passport");

const logInRouter = Router();


logInRouter.get("/", (req, res) => {
  res.render("login");
});

logInRouter.post("/", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in"
}

));



module.exports = logInRouter;
