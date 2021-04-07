// routes/home.js

var express = require("express");
var router = express.Router();
var passport = require("../config/passport"); // 1
// Home
router.get("/", function (req, res) {
  console.log("home.js / session:" + req.isAuthenticated());
  res.render("home/welcome");
});
router.get("/about", function (req, res) {
  res.render("home/about");
});
// Login // 2
router.get("/login", function (req, res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
    username: username,
    errors: errors,
  });
});

// Post Login // 3
router.post(
  "/login",
  function (req, res, next) {
    console.log("home.js session:" + req.isAuthenticated());
    var errors = {};
    var isValid = true;
    console.log(
      "route/home.js//" + req.body.username + "/" + req.body.password
    );
    if (!req.body.username) {
      isValid = false;
      errors.username = "Username is required!";
    }
    if (!req.body.password) {
      isValid = false;
      errors.password = "Password is required!";
    }

    if (isValid) {
      next();
    } else {
      req.flash("errors", errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log("page move before:" + req.isAuthenticated());
    res.redirect("/posts");
  }
);

// Logout // 4
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
