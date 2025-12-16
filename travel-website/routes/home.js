const express = require("express");
const router = express.Router();
const { connect } = require("../database");

// ---------- HOME PAGE ----------
router.get("/home", (req, res) => {
    const username = req.session.user.username;
    
    // Pass categories dynamically
    const categories = [
        { name: "Hiking", img: "/hiking.png", route: "/category/hiking" },
        { name: "Cities", img: "/cities.png", route: "/category/cities" },
        { name: "Islands", img: "/islands.png", route: "/category/islands" },
        { name: "Beaches", img: "/beaches.png", route: "/category/beaches" },
        { name: "Mountains", img: "/mountains.png", route: "/category/mountains" },
    ];

    res.render("home", { username, categories });
});

// ---------- CATEGORY PAGE ----------
router.get("/category/:name", async (req, res) => {
    const category = req.params.name;

    const db = await connect();
    const destinations = db.collection("destinations");

    const list = await destinations.find({ category }).toArray();

    res.render("category", {
        category,
        destinations: list
    });
});

// ---------- WANT-TO-GO LIST ----------
router.get("/want-to-go", async (req, res) => {
    const db = await connect();
    const users = db.collection("myCollection");

    const user = await users.findOne({ username: req.session.user.username });

    res.render("wantToGo", { list: user.wantToGo });
});

module.exports = router;
