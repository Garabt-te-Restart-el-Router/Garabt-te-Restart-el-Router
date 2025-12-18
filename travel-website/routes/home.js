const express = require("express");
const router = express.Router();
const { connect } = require("../database");

/* =========================
   HOME PAGE
========================= */
router.get("/home", (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    const username = req.session.user.username;

    const categories = [
        { name: "Hiking", img: "/hiking.png", route: "/category/hiking" },
        { name: "Cities", img: "/cities.png", route: "/category/cities" },
        { name: "Islands", img: "/islands.png", route: "/category/islands" },
        { name: "Beaches", img: "/beaches.png", route: "/category/beaches" },
        { name: "Mountains", img: "/mountains.png", route: "/category/mountains" },
    ];

    res.render("home", { username, categories });
});

/* =========================
   CATEGORY PAGE
   (USES myCollection ONLY)
========================= */
router.get("/category/:name", async (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    const category = req.params.name;

    const db = await connect();
    const myCollection = db.collection("myCollection");

    // Get ALL destinations in this category
    const list = await myCollection.find({
        category: category
    }).toArray();

    const actualCategoryName =
        list.length > 0 ? list[0].actualCategoryName : category;

    res.render("category", {
        category,
        actualCategoryName,
        myCollection: list
    });
});

/* =========================
   WANT-TO-GO LIST
   (NO LIMIT, NO PAGINATION)
========================= */
router.get("/want-to-go", async (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    const db = await connect();
    const myCollection = db.collection("myCollection");

    const username = req.session.user.username;

    const user = await myCollection.findOne({ username });

    if (!user || !user.wantToGo || user.wantToGo.length === 0) {
        return res.render("wantToGo", { myCollection: [] });
    }

    // Fetch destinations FROM SAME COLLECTION
    const list = await myCollection.find({
        name: { $in: user.wantToGo }
    }).toArray();

    res.render("wantToGo", {
        myCollection: list
    });
});

/* =========================
   REMOVE FROM WANT-TO-GO
========================= */
router.post("/destination/:name/remove", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");

        const db = await connect();
        const myCollection = db.collection("myCollection");

        const username = req.session.user.username;
        const destName = req.params.name.toLowerCase().trim();

        await myCollection.updateOne(
            { username },
            { $pull: { wantToGo: destName } }
        );

        res.redirect("/want-to-go");

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
