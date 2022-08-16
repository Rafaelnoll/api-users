require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI);

app.get("/", (req, res) => {
    res.json({});
});

module.exports = app;