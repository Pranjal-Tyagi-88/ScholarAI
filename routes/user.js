const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const auth = require("../middleware/auth.js");
const scholarship = require("../models/scholarship.js");
const admin = require("../middleware/admin.js");



router.get("/adminTest", auth, admin, (req, res) => {
    res.send("Welcome Admin");
});


router.get("/profile", auth, (req, res) => {
    res.send(req.user);
});

router.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
        ...req.body,
        password: hashedPassword,
    };

    const user = new User(userData);
    user.save()
        .then((savedUser) => {
            res.send(savedUser);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error registering user");
        });

});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user) {
        return res.status(401).send("Invalid credentials");
    }
    if (user.isbanned) {
        return res.status(403).send("User has been suspended");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send("Invalid credentials");
    }
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(payload, JWT_SECRET);
    res.send({
        message: "Login successful",
        token: token,
    });
});




router.post("/save/:Sid", auth, async (req, res, next) => {
    try {

        let id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        let Sid = req.params.Sid;
        if (user.savedScholarships.some( id => id.toString() === Sid)) {
            return res.status(400).send("Scholarship already saved");
        }
        user.savedScholarships.push(Sid);
        await user.save();
        res.send(user);
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
})

router.delete("/unsave/:Sid", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.savedScholarships = user.savedScholarships.filter(
            id => id.toString() !== req.params.Sid
        );
        await user.save();
        res.send("Scholarship removed from saved list");
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});


router.get("/saved", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).populate("savedScholarships");
        return res.send(user);
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});



module.exports = router;