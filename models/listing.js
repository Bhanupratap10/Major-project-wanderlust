const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
      filename: String,
      url: {
          type: String,
          default: "",
          set: (v) =>
              v === "" 
             ? ""
             :v,
         },
  },
  price: Number,
  location: String,
  country: String,
  review: [
     {
      type: Schema.Types.ObjectId,
      ref: "Review",
     },
  ],
}); 

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;