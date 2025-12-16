const express = require("express");
const router = express.Router();
const { connect } = require("../database"); // Adjust path if necessary

// 1. API Route for the Dropdown (Returns JSON)
router.get("/api/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        const db = await connect();
        const destinations = db.collection("destinations");

        // Find destinations that match the query (case-insensitive)
        // Limiting to 5 results to keep the dropdown neat
        const results = await destinations.find({
            name: { $regex: query, $options: "i" }
        }).limit(5).toArray();

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
});

// 2. Standard Route for the "Search" Button (Renders Page)
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        const db = await connect();
        const destinations = db.collection("destinations");

        let results = [];
        if (query) {
            results = await destinations.find({
                name: { $regex: query, $options: "i" }
            }).toArray();
        }

        // Render the search.ejs page you provided
        res.render("search", { 
            results: results, 
            notFound: results.length === 0,
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.render("search", { results: [], notFound: true });
    }
});

module.exports = router;