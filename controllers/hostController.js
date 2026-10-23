const Home = require("../models/home");
const fs = require("fs/promises");

const renderHomeForm = (
  req,
  res,
  { home = {}, editing = false, errors = [], status = 200, pageTitle } = {},
) =>
  res.status(status).render("host/edit-home", {
    home,
    pageTitle: pageTitle || (editing ? "Edit your Home" : "Add Home to airbnb"),
    currentPage: editing ? "host-homes" : "addHome",
    editing,
    errors,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });

const removeUploadedPhoto = async (file) => {
  if (!file) return;

  try {
    await fs.unlink(file.path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getAddHome = (req, res, next) => {
  renderHomeForm(req, res);
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.id;
  const editing = req.query.editing === "true";

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log("Home not found for editing.");
        return res.redirect("/host/host-home-list");
      }

      console.log(homeId, editing, home);
      renderHomeForm(req, res, {
        home,
        pageTitle: "Edit your Home",
        editing,
      });
    })
    .catch(next);
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log(houseName, price, location, rating, description);
  console.log(req.file);

  if (!res.file) {
    console.log("No image Provided");
    return res.status(422).send("No image provided");
  }
  const photo = req.file.path;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home
    .save()
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch(async (error) => {
      if (error.name === "ValidationError") {
        try {
          await removeUploadedPhoto(req.file);
        } catch (cleanupError) {
          return next(cleanupError);
        }
        return renderHomeForm(req, res, {
          home: req.body,
          errors: Object.values(error.errors).map(
            (fieldError) => fieldError.message,
          ),
          status: 422,
        });
      }
      next(error);
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  const photo = req.file.path;
  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.photo = photo;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting file", err);
          } 
        });
          home.photo = req.file.path;

      }

      home
        .save()
        .then((result) => {
          console.log("Home update", result);
        })
        .catch((err) => {
          console.log("Error while updating", err);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while finding home", err);
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete ", homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};
