//Core Modules
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");
const { error } = require("console");
const homeDataPath = path.join(rootDir, "data", "homes.json");

//fake Database
let registeredHomes = [];

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
  }


  save() {
    this.id = Math.random().toString();
    Home.fetchAll(registeredHomes => {
      registeredHomes.push(this);
      fs.writeFileSync(homeDataPath, JSON.stringify(registeredHomes), error => {
      });
    })

  }

  static fetchAll(callback) {
    const fileContent = fs.readFile(homeDataPath, (err, data) => {
      if (!err) {
        registeredHomes = JSON.parse(data);
      }
      callback(registeredHomes);
    })
  }

  static findById(homeId, callback) {
    this.fetchAll(homes => {
      const homeFound = homes.find(home => home.id === homeId);
      callback(homeFound);
    });
  }
}