const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "scholarai_secret_key";
const auth = require("../middleware/auth.js");
const scholarship = require("../models/scholarship.js");
const admin = require("../middleware/admin.js");



router.get("/test", (req, res) => {
    res.send("User Route Working");
});


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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send("Invalid credentials");
    }
    const payload = {
        id: user._id,
        email: user.email,
        role : user.role
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
        user.savedScholarships.push(Sid);
        await user.save();
        res.send(user);
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
})




router.get("/saved", auth , async (req, res) => {
    try {
        let user = await User.findById(req.user.id).populate("savedScholarships");
        return res.send(user);
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
});



module.exports = router;