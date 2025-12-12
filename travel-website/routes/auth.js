const express = require("express");
const router = express.Router();
const { connect } = require("../database");

// ---------- LOGIN PAGE ----------
router.get("/login", (req, res) => {
    res.render("login", { error: null, success: null });
});

// ---------- REGISTRATION PAGE ----------
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

// ---------- REGISTER POST ----------
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const db = await connect();
    const users = db.collection("myCollection");

    // Empty fields?
    if (!username || !password) {
        return res.render("register", { error: "All fields are required." });
    }

    // Check if user already exists
    const existing = await users.findOne({ username });
    if (existing) {
        return res.render("register", { error: "Username already exists." });
    }

    // Insert user
    await users.insertOne({
        username,
        password,
        wantToGo: []
    });

    return res.render("login", {
        error: null,
        success: "Registration successful! Please log in."
    });
});

// ---------- LOGIN POST ----------
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const db = await connect();
    const users = db.collection("myCollection");

    const user = await users.findOne({ username });

    if (!user || user.password !== password) {
        return res.render("login", { error: "Invalid username or password.", success: null });
    }

    // Set session
    req.session.user = user;

    return res.redirect("/home");
});

// ---------- LOGOUT ----------
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
