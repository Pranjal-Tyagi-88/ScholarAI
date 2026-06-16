const jwt = require("jsonwebtoken");
const users = require("../models/users");
const JWT_SECRET = process.env.JWT_SECRET;


const admin = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).send("Not authorized to do this");
    }
    next();
};

module.exports = admin;