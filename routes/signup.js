const { Router } = require("express");

const signUpRouter = Router();

signUpRouter.get("/", (req, res) => {
  res.render("signup");
});

signUpRouter.post("/", async(req, res) => {
  // logic for entering new user in the database
});
