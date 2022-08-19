const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWTSecret = process.env.JWT_SECRET;

router.post("/user", async (req, res) => {
    const { name, email, password } = req.body;

    if (name == "", email == "", password == "") {
        res.sendStatus(400);
        return;
    }

    try {
        const user = await UserModel.findOne({ "email": email });

        if (user != undefined) {
            res.statusCode = 400;
            res.json({ error: "E-mail already registered" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hash
        });
        await newUser.save();
        res.json({ email: email });
        return;

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post("/auth", async (req, res) => {
    const { email, password } = req.body;

    if (email && password != undefined) {
        const user = await UserModel.findOne({ "email": email });
        const correct = bcrypt.compare(password, user.password);

        if (correct) {
            jwt.sign({ email }, JWTSecret, { expiresIn: "48h" }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                    return;
                }
                res.json({ token });
            });
            return;
        }

        res.sendStatus(400);
        return;
    }

    res.sendStatus(404);
});

// This route is just for development mode and is used just in tests
router.delete("/user/:email", async (req, res) => {
    const { email } = req.params;
    await UserModel.deleteOne({ "email": email });
    res.sendStatus(200);
});

module.exports = router;