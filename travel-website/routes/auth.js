// routes/auth.js
const express = require("express");
const router = express.Router();
const { connect } = require("../database");

/* =========================
   LOGIN PAGE
========================= */
router.get("/login", (req, res) => {
    res.render("login", { error: null, success: null });
});

/* =========================
   REGISTER PAGE
========================= */
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

/* =========================
   REGISTER POST
========================= */
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render("register", {
                error: "All fields are required."
            });
        }

        const db = await connect();
        const myCollection = db.collection("myCollection");

        // IMPORTANT:
        // Make sure we only check USER documents
        const existingUser = await myCollection.findOne({
            username,
            password: { $exists: true }
        });

        if (existingUser) {
            return res.render("register", {
                error: "Username already exists."
            });
        }

        await myCollection.insertOne({
            username,
            password,
            wantToGo: []
        });

        res.render("login", {
            error: null,
            success: "Registration successful! Please log in."
        });

    } catch (err) {
        console.error(err);
        res.render("register", {
            error: "Something went wrong. Please try again."
        });
    }
});

/* =========================
   LOGIN POST
========================= */
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const db = await connect();
        const myCollection = db.collection("myCollection");

        // Only match USER documents
        const user = await myCollection.findOne({
            username,
            password
        });

        if (!user) {
            return res.render("login", {
                error: "Invalid username or password.",
                success: null
            });
        }

        req.session.user = {
            username: user.username,
            wantToGo: user.wantToGo || []
        };

        res.redirect("/home");

    } catch (err) {
        console.error(err);
        res.render("login", {
            error: "Server error. Please try again.",
            success: null
        });
    }
});

/* =========================
   LOGOUT
========================= */
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
