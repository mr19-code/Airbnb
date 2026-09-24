// Core Module
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();
const hostController = require('../controllers/hostController');

// Local Module
const rootDir = require("../utils/pathUtil");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:id", hostController.getEditHome);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);
module.exports = hostRouter;
