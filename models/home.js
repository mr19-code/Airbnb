
const { getDb } = require('../utils/databaseUtil');
module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl, description, id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
    this.id = id;
  }

  save() {
    const db = getDb();
    return db.collection('homes').insertOne(this)

  }

  static fetchAll() {

  }

  static findById(homeId) {

  }

  static deleteById(homeId) {
    const db = getDb();
    return db.collection('homes').deleteOne({ id: homeId });
  }
};