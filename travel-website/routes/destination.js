const express = require("express");
const router = express.Router();
const { connect } = require("../database");

/* =========================
   DESTINATION PAGE
   (SINGLE COLLECTION)
========================= */
router.get("/destination/:name", async (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    const db = await connect();
    const myCollection = db.collection("myCollection");

    const name = req.params.name.toLowerCase().trim();

    // Find destination from SAME collection
    const destination = await myCollection.findOne({ name });

    if (!destination) {
        return res.status(404).send("Destination not found");
    }

    /*
      IMPORTANT:
      You are rendering a dynamic EJS file
      named after the destination (e.g. paris.ejs)
    */
    res.render(destination.name, {
        name: destination.name,
        actualName: destination.actualName || destination.name,
        category: destination.category,
        country: destination.country,
        actualCategoryName: destination.actualCategoryName,
        description: destination.description
    });
});

/* =========================
   ADD TO WANT-TO-GO
========================= */
router.post("/destination/:name/add", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("Not logged in");
    }

    const db = await connect();
    const myCollection = db.collection("myCollection");

    const username = req.session.user.username;
    const name = req.params.name.toLowerCase().trim();

    const result = await myCollection.updateOne(
        { username },
        { $addToSet: { wantToGo: name } }
    );

    if (result.modifiedCount === 0) {
        return res.send("Already in your Want-To-Go list");
    }

    res.send("Added to your Want-To-Go list");
});

module.exports = router;
