const express = require("express");
const server = express();
const session = require("express-session");
const mongoose = require('mongoose');
const passport = require('./config/passportConfig');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const checkUser = require('./config/loginBlocker');
require('dotenv').config();
/*

*/
mongoose.connect(process.env.MONGODB, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
  }, 
  () => {
      console.log("mongeese is running away");
  }
);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(expressLayouts);

/*-- These must be place in the correct place */
server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
  })
);
//-- passport initialization
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

server.use(function(request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash();
  response.locals.currentUser = request.user;
  next();
});

server.get("/", (req, res) => {
  res.redirect("/dashboard");
});
//routes go here
server.use("/s/", require("./routes/senior.route"));
server.use("/h/", require("./routes/helper.route"));
server.use(require("./routes/auth.route"));


server.listen(process.env.PORT, () => {
  console.log(`connected to express on ${process.env.PORT}`);
})
