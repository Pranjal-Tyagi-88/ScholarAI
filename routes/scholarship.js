const express = require("express");
const router = express.Router();

const Scholarship = require("../models/scholarship.js");
const User = require("../models/users");

const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");


router.get("/all", async (req, res) => {
    try {
        const allListings = await Scholarship.find();
        let updatedListing = [];
        for (let listing of allListings) {
            const today = new Date();
            const deadline = new Date(listing.deadline);
            const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
            let status;
            if (daysLeft < 0)
                status = "Expired";
            else if (daysLeft <= 7)
                status = "Expiring Soon";
            else
                status = "Active";

            updatedListing.push({ ...listing.toObject(), daysLeft, status });
        }
        res.send(updatedListing);
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});



router.get("/expiring-soon", async (req, res) => {
    try {
        const allListings = await Scholarship.find();
        let expiring = [];
        for (let listing of allListings) {
            const today = new Date();
            const deadline = new Date(listing.deadline);
            const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
            if (daysLeft >= 0 && daysLeft <= 7) {
                expiring.push({ ...listing.toObject(), daysLeft, status: "Expiring Soon" });
            }
        }
        res.send(expiring);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
});






router.get("/recommendations", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const scholarships = await Scholarship.find();
        const MIN_SCORE = 60;
        const MAX_SCORE = 120;
        let recommendations = [];
        for (let scholarship of scholarships) {
            let reasons = [];
            let score = 0;
            if (scholarship.state === user.state || scholarship.state === "All India") {
                score += 25;
                reasons.push("State Match");
            }

            if (scholarship.category === user.category || scholarship.category === "All") {
                score += 25;
                reasons.push("Category Match");
            }

            if (user.income <= scholarship.incomeLimit) {
                score += 20;
                reasons.push("Income Under Limit");
            }

            if (user.educationLevel === scholarship.educationLevel) {
                score += 20;
                reasons.push("Education Matched ");
            }

            if (scholarship.studentType === user.studentType || scholarship.studentType === "All") {
                score += 20;
                reasons.push("Student Type Match");
            }

            if (user.cgpa >= scholarship.minCGPA) {
                score += 10;
                reasons.push("CGPA Eligible");
            }
            let percentage = Math.round((score / MAX_SCORE) * 100);
            if (score >= MIN_SCORE) {
                recommendations.push({ ...scholarship.toObject(),score, percentage, reasons });
            }
        }
        recommendations.sort((a, b) => b.score - a.score);
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