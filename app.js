require('dotenv').config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const path = require("path");

const prisma = new PrismaClient();

async function main() {

  await prisma.user.create({
    data: {
      name: "charles",
      posts: {
        create: { content: "hello world" },
      },
    },
  });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true
    }
  });
  console.dir(allUsers, { depth: null })
}

main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect()
  process.exit(1)
});


const app = express();
const PORT = process.env.PORT || 3000;
const logInRouter = require("./routes/login");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
// app.sesssion would go here// 

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
}
)
);

app.use(passport.session());


app.use("/log-in", logInRouter);

app.use("/upload", (req, res) => {
  res.send("we are in the upload");
});


app.get("/", (req, res) => {
  if (!req.user) {
    return res.render("sign-in");
  }
  res.send("we are in the index");
});

app.use((req, res, next) => {
  console.log("no route was found");
  res.status(404).send("404: not found!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});


