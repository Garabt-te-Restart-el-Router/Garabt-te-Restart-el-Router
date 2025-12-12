const express = require("express");
const router = express.Router();
const { connect } = require("../database");

// ---------- DESTINATION PAGE ----------
router.get("/destination/:name", async (req, res) => {
    const db = await connect();
    const destinations = db.collection("destinations");

    const name = req.params.name;
    const dest = await destinations.findOne({ name });

    res.render("destination", {
        destination: dest,
        error: null
    });
});

// ---------- ADD TO WANT-TO-GO ----------
router.post("/destination/:name/add", async (req, res) => {
    const db = await connect();
    const users = db.collection("myCollection");

    const username = req.session.user.username;
    const destName = req.params.name;

    const user = await users.findOne({ username });

    if (user.wantToGo.includes(destName)) {
        return res.render("destination", { destination: { name: destName }, error: "Already in list." });
    }

    await users.updateOne(
        { username },
        { $push: { wantToGo: destName } }
    );

    res.redirect("/want-to-go");
});

module.exports = router;
