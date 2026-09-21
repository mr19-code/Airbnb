// Core Module
const path = require('path');

// External Module
const express = require('express');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const { pageNotFound } = require("./controllers/errors");
const { mongoConnect } = require('./utils/databaseUtil');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(storeRouter);
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(pageNotFound);

const START_PORT = 3000;
mongoConnect((client) => {
  console.log(client);
  function startServer(port = START_PORT) {

    const server = app.listen(port, () => {
      console.log(`Server running on address http://localhost:${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy. Trying ${port + 1}...`);
        startServer(port + 1);
        return;
      }

      throw error;
    });
  }
  startServer();
});




