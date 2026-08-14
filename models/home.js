//Core Modules
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");
const { error } = require("console");

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
    Home.fetchAll(registeredHomes => {
      registeredHomes.push(this);
      const homeDataPath = path.join(rootDir, "data", "homes.json");
      fs.writeFileSync(homeDataPath, JSON.stringify(registeredHomes), error => {
      });
    })

  }

  static fetchAll(callback) {
    const homeDataPath = path.join(rootDir, 'data', 'homes.json');
    const fileContent = fs.readFile(homeDataPath, (err, data) => {
      if (!err) {
        registeredHomes = JSON.parse(data);
      }
      callback(registeredHomes);
    })
  }
}
