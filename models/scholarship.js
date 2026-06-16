const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScholarshipSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    provider: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    state: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    educationLevel: {
        type: String,
        required: true,
    },

    incomeLimit: {
        type: Number,
        required: true,
    },

    minCGPA: {
        type: Number,
        required: true,
    },

    deadline: {
        type: Date,
        required: true,
    },

    description: {
        type: String,
    },

    applicationLink: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Scholarship", ScholarshipSchema);