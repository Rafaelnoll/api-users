const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const UserModel = mongoose.model("user", user);

module.exports = UserModel;