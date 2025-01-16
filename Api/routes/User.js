const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const User = require("../models/User");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

Router.post("/signup", async function (req, res) {
  try {
    const users = await User.findOne({ email: req.body.email });
    if (users.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hascode = await bcrypt.hash(req.body.password, 10);
    console.log(hascode);
    const uploadedImage = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath
    );
    const newUser = new User({
      _id: mongoose.Schema.Types.ObjectId,
      channel_name: req.body.channel_name,
      email: req.body.email,
      phone: req.body.phone,
      password: hascode,
      logourl: uploadedImage.secure_url,
      logoId: uploadedImage.public_id,
      subscribers: { type: Number, default: 0 },
      subscribed: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    });

    const user = await newUser.save();
    res.status(200).json({
      message: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
module.exports = Router;
