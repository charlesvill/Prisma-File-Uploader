const { Router } = require("express");
const passport = require("passport");
const signUpRouter = Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

signUpRouter.get("/", (req, res) => {
  res.render("signup");
});

signUpRouter.post("/", async (req, res) => {
  // pull the req.body fields for the username and passwords and confirm passwords
  const {
    username,
    firstname,
    lastname,
    password,
    confirmpass
  } = req.body;

  // compare the passwords 
  if (confirmpass !== password) {
    //throw error
    return res.send("Passwords dont match!");
  }

  try {

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      await prisma.user.create({
        data: {
          name: firstname,
          username: username,
          hash: hashedPassword
        }
      });

      console.log('user created successfully!')

      res.redirect("/log-in");
    });

  } catch (error) {
    console.error(error);

    return res.redirect("/sign-up");

  }
  // try to use prisma to create the new user in a try catch block 
  // throw error and try to transfer the error code if its a username that exists
  // redirect to log in if it was successful
});

module.exports = signUpRouter;
