const express = require("express");
const router = express.Router();

// POSTS ROUTE

// index route
router.get("/", (req, res) => {
    res.send("GET for posts");
});

//show route
router.get("/:id", (req, res) => {
    res.send("GET for posts id");
});

//POST route
router.get("/", (req, res) => {
    res.send("POST for posts");
});

//delete  route
router.delete("/:id", (req, res) => {
    res.send("DELETE for posts id");
});

module.exports = router;