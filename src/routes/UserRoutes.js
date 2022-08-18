const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");

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
            res.json({ error: "E-mail já cadastrado" });
            return;
        }

        const newUser = new UserModel({
            name,
            email,
            password
        });
        await newUser.save();
        res.json({ email: email });
        return;

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;