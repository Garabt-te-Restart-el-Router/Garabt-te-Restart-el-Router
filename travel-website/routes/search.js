const express = require("express");
const router = express.Router();
const { connect } = require("../database");

// 1. API Route for the Dropdown (Returns JSON)
router.get("/api/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        const db = await connect();
        // Based on your file name, we are querying 'myCollection'
        const collection = db.collection("myCollection");

        // QUERY LOGIC:
        // 1. Search for matches in 'name', 'actualName', or 'country'
        // 2. AND ensure 'actualName' exists (this excludes User documents)
        const results = await collection.find({
            $and: [
                { actualName: { $exists: true } }, // Filter: Must be a destination
                {
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { actualName: { $regex: query, $options: "i" } },
                        { country: { $regex: query, $options: "i" } }
                    ]
                }
            ]
        }).limit(5).toArray();

        res.json(results);
    } catch (err) {
        console.error("Search API Error:", err);
        res.status(500).json([]);
    }
});

// 2. Standard Route for the "Search" Button (Renders Page)
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        const db = await connect();
        const collection = db.collection("myCollection");

        let results = [];
        if (query) {
            results = await collection.find({
                $and: [
                    { actualName: { $exists: true } }, // Filter: Must be a destination
                    {
                        $or: [
                            { name: { $regex: query, $options: "i" } },
                            { actualName: { $regex: query, $options: "i" } },
                            { country: { $regex: query, $options: "i" } }
                        ]
                    }
                ]
            }).toArray();
        }

        res.render("search", { 
            results: results, 
            notFound: results.length === 0,
            user: req.session.user 
        });
    } catch (err) {
        console.error("Search Page Error:", err);
        res.render("search", { results: [], notFound: true });
    }
});

module.exports = router;