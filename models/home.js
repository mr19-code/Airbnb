
const db = require("./utils/databaseUtil");
module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
  }

  save() {

  }

  static fetchAll(callback) {
    // db.execute("SELECT * FROM homes").then(([rows, fields]) => {
    //   console.log('Getting From DB', rows);
    // })
    //   .catch(error => {
    //     console.error('Error executing query:', error);
    //   })


  }

  static findById(homeId, callback) {

  }

  static deleteById(homeId, callback) {
    this.fetchAll(homes => {
      homes = homes.filter(home => home.id !== homeId);
      fs.writeFile(homeDataPath, JSON.stringify(homes),
        error => {
          Favourite.deleteById(homeId, callback);
        })
    });

  }

};