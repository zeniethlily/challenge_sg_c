const router = require("express").Router();
const User = require("../models/user.model");
const List = require("../models/list.model");
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");



router.get("/auth/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/auth/signup", async (req, res) => {
  console.log(req.body);
  try {
    let user = new User(req.body);

    if (req.body.role == "helper") {
      user.isHelper = true;
    } else if (req.body.role == "senior"){
      user.isSenior = true;
    }

    let savedUser = await user.save();

    if (savedUser) {
      passport.authenticate("local", {
        successRedirect: "/dashboard", //after login success
        successFlash: "You have logged In!"
      })(req, res);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/auth/signin", (req, res) => {
  res.render("auth/signin");
});

router.get("/dashboard", isLoggedIn, (req, res) => {
  if(req.user.isSenior){
    User.findById(req.user._id, "list")
    .populate("list")
    .then(user => {
      let lists = user.list;
      res.render("dashboard/index", { lists });
    });
  } else if(req.user.isHelper){
    List.find({ status: "free" }).then(lists => {
      res.render("dashboard/index", { lists });
    });
  }
})

//-- Login Route
router.post(
  "/auth/signin",
  passport.authenticate("local", {
    successRedirect: "/dashboard", //after login success
    failureRedirect: "/auth/signin", //if fail
    failureFlash: "Invalid Username or Password",
    successFlash: "You have logged In!"
  })
);

//--- Logout Route
router.get("/auth/logout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "Dont leave please come back!");
  response.redirect("/auth/signin");
});

module.exports = router;