require("dotenv").config();
const express = require("express");
const app = express();

const userRouter = require("./routes/user");
// const User = require("./models/users.js");
const scholarshipRouter = require("./routes/scholarship");



const applicationRouter = require("./routes/application");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/scholarship", scholarshipRouter);
app.use("/application" , applicationRouter);


//DATABASE CONNECTIVITY
const connectDB = require("./db");
connectDB();


let port = process.env.PORT;

app.listen(port , () =>{
        console.log(`app is listening on port ${port}`);
    });