// Core Module
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();
const hostController = require('../controllers/hostController');

// Local Module
const rootDir = require("../utils/pathUtil");

hostRouter.get("/add-home", hostController.getHomePage);
hostRouter.post("/add-home", hostController.addHome);
hostRouter.get("/homes", hostController.getHomes);
hostRouter.get("/host-home-list", hostController.getHostHomes);
module.exports = hostRouter;
