const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Validate Reviews
const validateReview = (req, res, next) => {
    let {err} = reviewSchema.validate(req.body);
    if (err) {
        let errMsg = err.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
//Reviews
//Post Review Route
router.post("/", 
  validateReview,
  wrapAsync (async (req, res) => {
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
   console.log(req.params.id);
   listing.review.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success", "New Review Created!");
   res.redirect(`/listings/${listing._id}`);
})
);

// Delete Review Route
router.delete(
   "/:reviewId",
   wrapAsync(async (req, res) => {
       let { id, reviewId } = req.params;

       await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
       await Review.findByIdAndDelete(reviewId);
       req.flash("success", "Review Deleted!");
       res.redirect(`/listings/${id}`);
   })
);

module.exports = router;