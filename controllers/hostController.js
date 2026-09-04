const Home = require("../models/home");
const registeredHomes = [];

const getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.id;
  const editing = req.query.editing === 'true';

  Home.findById(homeId, home => {
    if (!home) {
      console.log("Home not found");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit Your Home",
      currentPage: "host-Homes",
      home: home,
      homeId: homeId,
      editing: editing
    });
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
  const { houseName, price, location, rating, photoUrl, homeId, editing } = req.body;

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

exports.getAddHome = getAddHome;
exports.addHome = addHome;
exports.getHomes = getHomes;
exports.registeredHomes = registeredHomes;
