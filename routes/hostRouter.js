// Core Module
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();
const hostController = require('../controllers/hostController');
const uploadHomePhoto = require('../utils/homePhotoUpload');

// Local Module
const rootDir = require("../utils/pathUtil");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", uploadHomePhoto.single("photo"), hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:id", hostController.getEditHome);
hostRouter.post("/edit-home", uploadHomePhoto.single("photo"), hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);
module.exports = hostRouter;
