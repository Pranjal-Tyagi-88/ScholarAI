const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const sendEmail = require("../utils/sendMail");

const User = require("../models/users");
const Scholarship = require("../models/scholarship");
const application = require("../models/application");

router.get("/stats", auth, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalScholarships = await Scholarship.countDocuments();
        const totalApplications = await application.countDocuments();
        const users = await User.find();
        let totalSavedScholarships = 0;
        for (let user of users) {
            totalSavedScholarships += user.savedScholarships.length;
        }
        res.send({ totalUsers, totalScholarships, totalApplications, totalSavedScholarships });
    }
    catch (err) {
        res.status(500).send("Some error occured");
    }
});




router.get("/test-email", auth, admin, async (req, res) => {
    try {

        await sendEmail(
            process.env.EMAIL_USER,
            "ScholarAI Test Email",
            "Congratulations! Email notifications are working."
        );

        res.send("Test email sent successfully");

    } catch (err) {
        console.log(err);
        res.status(500).send("Email sending failed");
    }
});


router.put("/ban/:id", auth, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isbanned: true }, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User banned Successfully");
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});



router.put("/unban/:id", auth, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isbanned: false }, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User unbanned Successfully");
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});






module.exports = router;