const Home = require("../models/home");
const Favourite = require("../models/favourite");

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
  Favourite.getFavourites(favouriteIds => {
    Home.fetchAll(registeredHomes => {
      const favouriteHomes = registeredHomes.filter(home => favouriteIds.includes(home.id));
      res.render('store/favourite-list', {
        registeredHomes: favouriteHomes,
        pageTitle: 'My Favorites',
        currentPage: 'favorites'
      });
    });
  });
};

exports.postAddToFavourits = (req, res, next) => {
  Favourite.addToFavourite(req.body.id, error => {
    if (error) {
      console.log("Error while marketing favourite", error);
    }
    res.redirect('/favourites');
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log('At home Details page with ID:', homeId);
  Home.findById(homeId, home => {
    if (!home) {
      console.log('Home not found');
      res.redirect('/homes');
    } else {
      res.render('store/home-detail', {
        home: home,
        pageTitle: 'Home Details',
        currentPage: 'Home'
      });
    }
  });
}

