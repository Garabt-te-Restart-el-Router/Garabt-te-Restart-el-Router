const express = require("express");
const router = express.Router();
const { connect } = require("../database");

router.get("/search", async (req, res) => {
    const key = req.query.q;

    if (!key || key.trim() === "") {
        return res.render("search", { results: [], notFound: false });
    }

    const db = await connect();
    const destinations = db.collection("destinations");

    const results = await destinations.find({
        name: { $regex: key, $options: "i" }
    }).toArray();

    if (results.length === 0) {
        return res.render("search", { results: [], notFound: true });
    }

    res.render("search", { results, notFound: false });
});

module.exports = router;
