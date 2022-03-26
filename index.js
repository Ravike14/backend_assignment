const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

//routes
const routes = require("./util/routes");

//Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

//Path to API's
app.use("/api", routes);

// Listen to port # on express Server
app.listen(8080);
