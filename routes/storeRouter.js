// External Module
const express = require('express');
const storeRouter = express.Router();

const storeController = require('../controllers/storeController');

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/favourites", storeController.getFavoriteList);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.post("/favourites", storeController.postAddToFavourits);
storeRouter.post("/favourites/delete/:homeId", storeController.postDeleteFromFavourites);

module.exports = storeRouter;   