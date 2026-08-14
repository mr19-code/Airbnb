// External Module
const express = require('express');
const storeRouter = express.Router();

const homesController = require('../controllers/storeController');

storeRouter.get("/", homesController.getIndex);
storeRouter.get("/bookings", homesController.getBookings);
storeRouter.get("/homes", homesController.getHomes);
storeRouter.get("/favorites", homesController.getFavoriteList);

module.exports = storeRouter; 