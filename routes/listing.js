const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// index and create route
router
.route("/")
.get(wrapAsync (listingController.index))
// .post(
//     isLoggedIn,
//     validateListing,
//     wrapAsync (listingController.createListing)
// );
.post( upload.single('listing[image]'), ( req, res) => {
    res.send(req.file);
});

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// show, put and delete route
router
.route("/:id")
.get(wrapAsync (listingController.showlisting))
.put( 
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync (listingController.updatedListing)
)
.delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));

//Edit Route

router.get(
    "/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync (listingController.renderEditForm)
);

module.exports = router;