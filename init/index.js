const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken  = "pk.eyJ1IjoiaW5zcGlyZTI1NiIsImEiOiJjbThwZzkzb2cwMXhwMmlzY3VrNjQ3dGk4In0.XK929l_AotYhiPcPU2diWw"

console.log(mapToken)
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function response(listing) {
    let res = await geocodingClient
      .forwardGeocode({
        query: listing.location,
        limit: 1,
      })
      .send();
    return res.body.features[0].geometry;
  }
  
  async function initDataFunction() {
    await Listing.deleteMany({});
    for (let obj of initData.data) {
      obj.geometry = await response(obj); // Awaiting the response properly
    }
    initData.data = initData.data.map((obj) => ({...obj, owner: "67ec46a2168885527d9f1aed"}));
  
    await Listing.insertMany(initData.data);
    let listings =await Listing.find({});
    console.log(listings)
    console.log("Data was initialized");
  }
  
initDataFunction();