const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
      terms: "",
    },
    user: {},
  });
};

exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be atleast 2 characters long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("lastName")
    .trim()
    .optional({ values: "falsy" })
    .matches(/^[A-Za-z]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 5 })
    .withMessage("Password should be atleast 5 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one digit")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),

  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms").custom((value, { req }) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

  (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
      terms,
    } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((error) => error.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          userType,
          terms,
        },
        user: {},
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email: normalizedEmail,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/auth/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "Sign Up",
          currentPage: "signup",
          isLoggedIn: false,
          errors: [err.message],
          oldInput: {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            userType,
            terms,
          },
        });
      });
  },
];

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: { email },
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput: { email },
      user: {},
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = {
    _id: user._id.toString(),
    firstName: user.firstName,
    email: user.email,
    userType: user.userType,
  };
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};
