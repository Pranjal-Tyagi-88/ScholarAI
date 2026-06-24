require("dotenv").config();
require("./utils/reminderCron");
const express = require("express");
const app = express();

const userRouter = require("./routes/user");
const scholarshipRouter = require("./routes/scholarship");
const applicationRouter = require("./routes/application");
const adminRouter = require("./routes/admin");




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/scholarship", scholarshipRouter);
app.use("/application" , applicationRouter);
app.use("/admin" , adminRouter);


//DATABASE CONNECTIVITY
const connectDB = require("./db");
connectDB();


let port = process.env.PORT;

app.listen(port , () =>{
        console.log(`app is listening on port ${port}`);
    });