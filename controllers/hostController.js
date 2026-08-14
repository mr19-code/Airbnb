const Home = require("../models/home");
const registeredHomes = [];

const getHomePage = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
    res.render('host/host-home-list', {
      registeredHomes: registeredHomes,
      pageTitle: 'Host Homes List',
      currentPage: 'host-homes'
    });
  });

};

const addHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl } = req.body;

  const home = new Home(houseName, price, location, rating, photoUrl);
  home.save();
  registeredHomes.push(home);

  res.render('host/home-added', {
    pageTitle: 'Home Added Successfully',
    currentPage: 'homeAdded'
  });
};

const getHomes = (req, res, next) => {
  Home.fetchAll((homes) => {
    res.render('host/host-home-list', {
      registeredHomes: homes,
      pageTitle: 'Your Homes',
      currentPage: 'hostHomeList'
    });
  });
};

exports.getHomePage = getHomePage;
exports.addHome = addHome;
exports.getHomes = getHomes;
exports.registeredHomes = registeredHomes;
