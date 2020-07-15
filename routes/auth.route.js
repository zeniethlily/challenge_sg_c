const router = require("express").Router();
const User = require("../models/user.model");

const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");



router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    let { phone, password, firstname, lastname, dateOfBirth, role } = req.body;
    let user = new User({
      phone,
      firstname, 
      lastname, 
      address: {
        houseNo: req.body.houseNo, 
        street: req.body.street, 
        city: req.body.city, 
        district: req.body.district,
      },
      dateOfBirth,
      password,
    });
    if (role == "helper") {
      user.isHelper = true;
    } else {
      user.isSenior = true;
    }
    let savedUser = await user.save();
    if (savedUser) {
      res.redirect("/auth/signin");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

//-- Login Route
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/", //after login success
    failureRedirect: "/auth/signin", //if fail
    failureFlash: "Invalid Username or Password",
    successFlash: "You have logged In!"
  })
);

//--- Logout Route
router.get("/logout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "Dont leave please come back!");
  response.redirect("/auth/signin");
});

module.exports = router;