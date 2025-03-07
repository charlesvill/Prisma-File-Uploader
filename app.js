require('dotenv').config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const prisma = require("./prisma/prisma.js");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require("@prisma/client");
const passportConfig = require("./authentication/passport-config.js");

const path = require("path");
const logInRouter = require("./routes/login");
const signUpRouter = require("./routes/signup.js");
const uploadRouter = require("./routes/upload.js");
const folderRouter = require("./routes/folder.js");
const fileRouter = require("./routes/file.js");
const indexRouter = require("./routes/index.js");

const app = express();
const PORT = process.env.PORT || 3000;

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

passportConfig(passport, prisma);

app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
 })
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user; // Ensures `user` is available in all views
  next();
});

//this line below is test code
const uploadDir = path.join(__dirname, "uploads");

app.use("/log-in", logInRouter);
app.use("/sign-up", signUpRouter);
app.use("/upload", uploadRouter);
app.use("/uploads", express.static(uploadDir));
app.use("/folder", folderRouter);
app.use("/file", fileRouter);


// route for a folder you can create where you can read create update and deleete folders
// folders should read the contents of the files and the folder should store the id of the file
// should be able to read information about the file such as the file size, date created etc
// should be able to add/delete files from these folders as well. 

app.get("/", indexRouter);

app.use((req, res, next) => {
  console.log("no route was found");
  res.status(404).send("404: not found!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});


