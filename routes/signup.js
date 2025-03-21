const { Router } = require("express");
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
});

module.exports = signUpRouter;
