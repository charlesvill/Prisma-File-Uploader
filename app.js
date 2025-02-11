require('dotenv').config();
const express = require("express");
const path = require("path");


const app = express();
const PORT = process.env.PORT || 3000;

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.sesssion would go here// 

app.use("/upload", (req, res) => {
  res.send("we are in the upload");
});

app.use("/", (req, res) => {
  res.send("we are in the index");
});

app.use((req, res, next) => {
  console.log("no route was found");
  res.status(404).send("404: not found!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});


