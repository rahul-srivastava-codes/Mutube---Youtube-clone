const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Router = require("./routes/User");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/user", Router);
app.use(bodyparser.json());

mongoose.connect(process.env.Mongo_url);

app.get("/test", function (req, res) {
  console.log(req.body);
  console.log(req.files);
  res.status(200).json({
    message: "Success",
  });
});

module.exports = app;
