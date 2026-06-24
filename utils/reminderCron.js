const cron = require("node-cron");
const User = require("../models/users");
const sendEmail = require("./sendMail");

cron.schedule("0 9 * * *", async () => {
    try {
        const users = await User.find()
            .populate("savedScholarships");
        let emailsSent = 0;
        for (let user of users) {
            for (let scholarship of user.savedScholarships) {
                const today = new Date();
                const deadline = new Date(scholarship.deadline);
                const daysLeft = Math.ceil(
                    (deadline - today) / (1000 * 60 * 60 * 24)
                );
                if (daysLeft >= 0 && daysLeft <= 7) {
                    await sendEmail(
                        user.email,
                        "Scholarship Deadline Reminder",
                        `Your saved scholarship "${scholarship.title}" expires in ${daysLeft} day(s). Apply soon!`
                    );
                    emailsSent++;
                }
            }
        }
        console.log(`${emailsSent} reminder emails sent`);
    } catch (err) {
        console.log(err);
    }
});