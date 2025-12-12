// server.js
const express = require("express");
const session = require("express-session");
const path = require("path");
const { connect } = require("./database");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Sessions
app.use(session({
    secret: "supersecretkey123",
    resave: false,
    saveUninitialized: false
}));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to protect pages
function checkLogin(req, res, next) {
    const openPaths = ["/login", "/register"];
    if (openPaths.includes(req.path)) return next();
    if (!req.session.user) return res.redirect("/login");
    next();
}

app.use(checkLogin);

// Routes
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const destinationRoutes = require("./routes/destination");
const searchRoutes = require("./routes/search");
app.use("/", authRoutes);
app.use("/", homeRoutes);
app.use("/", destinationRoutes);
app.use("/", searchRoutes)

// Start server after DB connects
connect().then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
});
