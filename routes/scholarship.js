const express = require("express");
const router = express.Router();

const Scholarship = require("../models/scholarship.js");
const User = require("../models/users");

const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");


router.get("/test", (req, res) => {
    res.send("Scholarship Route working");
});


router.get("/all", async (req, res) => {
    try {
        const allListings = await Scholarship.find();
        res.send(allListings);
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});


router.get("/recommendations", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const scholarships = await Scholarship.find();

        let recommendations = [];

        for (let scholarship of scholarships) {
            if (
                (scholarship.state === user.state ||
                    scholarship.state === "All India")
                &&
                (scholarship.category === user.category ||
                    scholarship.category === "All")
                &&
                (user.income <= scholarship.incomeLimit)
                &&
                (user.educationLevel === scholarship.educationLevel)
                &&
                (user.cgpa >= scholarship.minCGPA)
            ) {
                recommendations.push(scholarship);
            }
        }

        res.send(recommendations);
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});



router.get("/search", async (req, res) => {
    try {

        let filter = {};

        if (req.query.state) {
            filter.state = req.query.state;
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.educationLevel) {
            filter.educationLevel = req.query.educationLevel;
        }

        const scholarships = await Scholarship.find(filter);

        res.send(scholarships);

    } catch (err) {
        res.status(500).send("Something went wrong");
    }
});








router.post("/add", auth, admin, async (req, res) => {
    const scholarship = new Scholarship(req.body);

    scholarship.save()
        .then((saved) => {
            res.send(saved);
        })
        .catch((err) => {
            res.status(500).send("Something went wrong");
        });
});


router.put("/update/:id", auth, admin, async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;

        let scholarship = await Scholarship.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!scholarship)
            return res.status(404).send("No such Scholarships");

        res.send(scholarship);
    }
    catch (err) {
        res.status(500).send("Cannot Update now");
    }
});


router.delete("/delete/:id", auth, admin, async (req, res) => {
    try {
        let id = req.params.id;

        let scholarship = await Scholarship.findByIdAndDelete(id);

        if (!scholarship)
            return res.status(404).send("No such Scholarships");

        res.send(scholarship);
    }
    catch (err) {
        res.status(500).send("Can't delete now");
    }
});


router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        let scholarship = await Scholarship.findById(id);

        if (!scholarship)
            return res.status(404).send("No such Scholarships");

        res.send(scholarship);
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});


module.exports = router;