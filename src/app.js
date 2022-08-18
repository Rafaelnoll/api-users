require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const UserRoutes = require("./routes/UserRoutes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI)
    .catch(err => {
        console.log(err);
    });

app.get("/", (req, res) => {
    res.json({});
});

app.use(UserRoutes);

module.exports = app;