// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("../lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require('path');
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');

// Database connection
const db = require('./database');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['process.env.KEY']
}));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/../styles",
    destination: __dirname + "/../public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const foodRoutes = require("./routes/foods");

// User Router
const userRouter = express.Router();
userRoutes(userRouter, db);
app.use("/users", userRouter);

// Food Router
const foodRouter = express.Router();
foodRoutes(foodRouter, db);
app.use("/foods", foodRouter);

// Order Router
const orderRouter = express.Router();
orderRoutes(orderRouter, db);
app.use("/orders", orderRouter);

// Note: mount other resources here, using the same pattern above
// Mount all resource routes

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
