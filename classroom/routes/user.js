const express = require("express");
const router = express.Router();

// index route
router.get("/", (req, res) => {
    res.send("GET for users");
});

//show route
router.get("/:id", (req, res) => {
    res.send("GET for user id");
});

//POST route
router.post("/", (req, res) => {
    res.send("POST for users");
});

//delete  route
router.delete("/:id", (req, res) => {
    res.send("DELETE for user id");
});


module.exports = router;