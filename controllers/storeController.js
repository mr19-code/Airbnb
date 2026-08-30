const Home = require("../models/home");
exports.getIndex = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
    res.render('store/index', {
      registeredHomes: registeredHomes,
      pageTitle: 'airbnb Home',
      currentPage: 'index'
    });
  });

};

exports.getHomes = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
    res.render('store/home-list', {
      registeredHomes: registeredHomes,
      pageTitle: 'Homes List',
      currentPage: 'Home'
    });
  });

};

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', {
    pageTitle: 'My Bookings',
    currentPage: 'bookings'
  });
};

exports.getFavoriteList = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
    res.render('store/favourite-list', {
      registeredHomes: registeredHomes,
      pageTitle: 'My Favorites',
      currentPage: 'favorites'
    });
  });
}

exports.postAddToFavourits = (req, res, next) => {
  console.log("Adding to favorites", req.body);
  res.redirect("/favourites");

}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("At home Details page with ID:", homeId);
  Home.findById(homeId, home => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render('store/home-detail', {
        home: home,
        pageTitle: 'Home Details',
        currentPage: 'Home'
      });
    }
  });
}




