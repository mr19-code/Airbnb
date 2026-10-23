// Core Module
const path = require("path");

// External Module
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const DB_PATH =
  "mongodb+srv://meet18:root@meet18.5u3yubv.mongodb.net/airbnb?retryWrites=true&w=majority";

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const { pageNotFound } = require("./controllers/errors");
const { default: mongoose } = require("mongoose");
const multer = require("multer");

const app = express();

const sessionStore = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

const randomString = (length) => {
   const charactors = 'abcdefghijklmnopqrstuvxyz';
   let result = '';
   for (let i = 0; i < length; i++) {
    result += charactors.charAt(Math.floor(Math.random() * charactors.length))
   }
return result;
}

const stronge = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,"uploads/")
    },
    filename: (req,file,cb) => {
      cb(null, randomString(10) + '-' + file.originalname )
    }
});

 const filleFilter = (req,file,cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpg') {
    cb(null,true);
  } else{
    cb(null,false)
  }
 }



const multerOptions ={
  stronge,filleFilter
}

// sessionStore.on("error", (error) => {
//   console.error("Session store error:", error);
// });

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static(path.join(rootDir,'uploads')));
app.use("/host/uploads",express.static(path.join(rootDir,'uploads')));
app.use("/homes/uploads",express.static(path.join(rootDir,'uploads')));
app.use(session({
  secret: "KnowledgeGate AI with Complete Coding",
  resave: false,
  saveUninitialized: true,
  
}))



app.use((req, res, next) => { 
  res.isLoggedIn = req.session.isLoggedIn
  next();
});

app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));

app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
});

app.use("/host", hostRouter);
app.use("/auth", authRouter);

app.use(pageNotFound);

const PORT = 3000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
