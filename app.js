const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utlis/wrapAsync.js");
const ExpressError = require("./utlis/ExpressError");
const { required } = require("joi");
const { listingSchema } = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
})
.catch ((err) => {
    console.log(err);
});

async function main() { // creating database
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi I am root");

});

const validateListing = (req, res, next) => {
    let (error) = listingSchema.validate(req.body); 
    if (error) {
        let errMsg = err.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
};

// index route
app.get("/listings",  wrapAsync (async (req, res) => {
     const allListings = await Listing.find({});
     res.render("listings/index.ejs", { allListings });

}));

//New Route

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
    
});

// Show Route

app.get("/listings/:id", wrapAsync (async (req, res) => {
    let {id} = req.params;
   const listing = await  Listing.findById(id)
   res.render("listings/show.ejs", { listing });
}));

//Create Route

app.post(
    "/listings", 
    validateListing,
    wrapAsync (async (req, res, next) => {
      const newListing = new Listing(req.body.listing); 
      await newListing.save();
      res.redirect("/listings"); 
    })
);

//Edit Route

app.get(
    "/listings/:id/edit", 
    wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update route

app.put(
    "/listings/:id", 
    validateListing,
    wrapAsync (async (req, res) => { 
    let { id } = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//Delete Route
 app.delete(
    "/listings/:id", 
    wrapAsync (async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
 }));

// app.get("/testListing", async (req, res) => {
//     let samplelisting =  new Listing ({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         locatin: "Jaunpur UP",
//         country: "India",
//     });
        
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// });
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Somthing went wrong"} = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("sever is listening to port");
});