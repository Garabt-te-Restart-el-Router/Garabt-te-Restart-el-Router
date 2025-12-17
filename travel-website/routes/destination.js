const express = require("express");
const router = express.Router();
const { connect } = require("../database");

// ---------- DESTINATION PAGE ----------
router.get("/destination/:name", async (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    const db = await connect();
    const destinations = db.collection("destinations");

    const name = req.params.name.toLowerCase();

    // 1️⃣ Check MongoDB
    const destination = await destinations.findOne({ name });

    if (!destination) {
        return res.status(404).send("Destination not found in database");
    }


    res.render(name, {
        name: destination.name,
        actualName: destination.actualName || name, //fallback
        category: destination.category
    });
});


// ---------- ADD TO WANT-TO-GO ----------
router.post("/destination/:name/add", async (req, res) => {
    if (!req.session.user) return res.status(401).send('Not logged in');

    const db = await connect();
    const users = db.collection("myCollection");

    const username = req.session.user.username;
    const name = req.params.name.toLowerCase();

    const result = await users.updateOne(
        { username },
        { $addToSet: { wantToGo: name } }
    );

    if (result.modifiedCount === 0) {
        return res.send('Already in your Want-to-Go');
    }

    res.send('Added to your Want-to-Go List');
});

module.exports = router;