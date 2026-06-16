const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Application = require("../models/application");


router.post("/apply/:scholarshipId", auth, async (req, res) => {
    try {
        const UserId = req.user.id;
        const Sid = req.params.scholarshipId;
        if (await Application.findOne({ user: UserId, scholarship: Sid }))
            return res.status(400).send("Already Applied");
        const application = new Application({ user: UserId, scholarship: Sid });
        await application.save();
        res.send(application);
    }
    catch (err) {
        res.status(500).send("Some error occured");
    }
});

router.get("/my-applications", auth, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id }).populate("scholarship");
        res.send(applications);
    }
    catch (err) {
        res.status(500).send("Some error occured");
    }
});














module.exports = router;