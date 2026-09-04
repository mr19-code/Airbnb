//Core Modules
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");
const favouriteDataPath = path.join(rootDir, "data", "favourites.json");

module.exports = class Favourite {
  static addToFavourite(homeId, callback) {
    Favourite.fetchAll((favourites) => {
      if (favourites.includes(homeId)) {
        console.log("Home is already marked as favourite");
        if (callback) callback(null);
      } else {
        favourites.push(homeId);
        fs.writeFile(favouriteDataPath, JSON.stringify(favourites), (error) => { 
          console.log("File Writing Concluded", error);
          if (callback) callback(error);
        });
      }
    });
  }

  static addToFavourites(homeId, callback) {
    return Favourite.addToFavourite(homeId, callback);
  }

  static fetchAll(callback) {
    fs.readFile(favouriteDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  static getFavourites(callback) {
    Favourite.fetchAll(callback);
  }

  static deleteById(homeId, callback) {
    Favourite.fetchAll(favourites => {
      const updatedFavourites = favourites.filter(id => id !== homeId);
      fs.writeFile(favouriteDataPath, JSON.stringify(updatedFavourites), (error) => {
        if (callback) callback(error);
      });
    });
  }
}