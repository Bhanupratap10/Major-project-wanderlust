const User = require("../models/user");

// render Signup form route

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// singup form route

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Go Rental!");
            res.redirect("/listings");
        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    } 
};

// render login form route

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// login form route

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome  back to Go Rental!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout form

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } 
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};

