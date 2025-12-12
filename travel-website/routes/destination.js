const express = require("express");
const router = express.Router();
const { connect } = require("../database");

// ---------- DESTINATION PAGE ----------
router.get("/destination/:name", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");

        const db = await connect();
        const destinations = db.collection("destinations");

        const name = req.params.name;
        const dest = await destinations.findOne({ name });

        if (!dest) return res.status(404).send("Destination not found");

        res.render(name, { error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// ---------- ADD TO WANT-TO-GO ----------
router.post("/destination/:name/add", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");

        const db = await connect();
        const users = db.collection("myCollection");
        const username = req.session.user.username;
        const destName = req.params.name;

        const user = await users.findOne({ username });

        if (user.wantToGo.includes(destName)) {
            return res.render(destName, { error: "Already in your Want-to-Go list." });
        }

        await users.updateOne({ username }, { $push: { wantToGo: destName } });
        res.redirect(`/destination/${destName}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
