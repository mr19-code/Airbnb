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

const postAddHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl, homeId, editing } = req.body;

  const home = new Home(houseName, price, location, rating, photoUrl);
  home.id = id;
  home.save();
  registeredHomes.push(home);

  res.redirect('host/home-list');
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll((homes) => {
    res.render('host/host-home-list', {
      registeredHomes: homes,
      pageTitle: 'Your Homes',
      currentPage: 'hostHomeList'
    });
  });
};
const postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl } = req.body;

  Home.findById(id, home => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    const updatedHome = new Home(houseName, price, location, rating, photoUrl);
    updatedHome.id = id;
    updatedHome.save();
    res.redirect("/host/host-home-list");
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete home:", homeId);
  Home.deleteById(homeId, error => {
    if (error) {
      console.log("Error deleting home:", error);
    }
    res.redirect("/host/host-home-list");
  });
};

exports.getAddHome = getAddHome;
exports.postAddHome = postAddHome;
exports.postEditHome = postEditHome;
exports.registeredHomes = registeredHomes;
