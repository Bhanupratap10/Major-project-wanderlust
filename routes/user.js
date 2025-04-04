const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utlis/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
.route("/signup")
.get(userController.renderSignupForm) // render signup  form route
.post(wrapAsync (userController.signup)); // signup form route

// render login form  route
router
.route("/login")
.get(userController.renderLoginForm) 
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
   }),
   userController.login
);

// logout route
router.get("/logout", userController.logout);


module.exports = router;