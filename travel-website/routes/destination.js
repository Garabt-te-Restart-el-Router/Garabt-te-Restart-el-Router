const express = require("express");
const router = express.Router();
const { connect } = require("../database");

// ---------- DESTINATION PAGE ----------
router.get("/destination/:name", async (req, res) => {
    try {
        const db = await connect();
        const destinations = db.collection("destinations");

        const name = req.params.name;
        const dest = await destinations.findOne({ name });

        if (!dest) {
            return res.status(404).send("Destination not found");
        }

        res.render("destination", {
            destination: dest,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// ---------- ADD TO WANT-TO-GO ----------
router.post("/destination/:name/add", async (req, res) => {
    try {
        const db = await connect();
        const users = db.collection("myCollection");
        const destinations = db.collection("destinations");

        // Check if user is logged in
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const username = req.session.user.username;
        const destName = req.params.name;

        // Find user and destination
        const user = await users.findOne({ username });
        const dest = await destinations.findOne({ name: destName });

        if (!dest) {
            return res.status(404).send("Destination not found");
        }

        // Check if already in wantToGo
        if (user.wantToGo.includes(destName)) {
            return res.render("destination", {
                destination: dest,
                error: "Already in your Want-to-Go list."
            });
        }

        // Add to wantToGo
        await users.updateOne(
            { username },
            { $push: { wantToGo: destName } }
        );

        // Redirect back to the same destination page
        res.redirect(`/destination/${destName}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
