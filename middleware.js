const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utlis/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;  // save redirect url 
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login"); // login page
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }

    next();
};

// validated listing method
module.exports.validateListing = (req, res, next) => {
    let {err} = listingSchema.validate(req.body); 
    if (err) {
        let errMsg = err.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
};

//Validate Reviews

module.exports.validateReview = (req, res, next) => {
    let {err} = reviewSchema.validate(req.body);
    if (err) {
        let errMsg = err.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this listing");
      return res.redirect(`/listings/${id}`);
    }

    next();
};