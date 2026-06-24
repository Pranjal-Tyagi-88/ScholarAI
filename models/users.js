const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    studentType: {
    type: String,
    enum: ["School", "College"],
    required: true
},

    state: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    income: {
        type: Number,
        required: true,
    },

    educationLevel: {
        type: String,
        required: true,
    },

    dateOfBirth: {
        type: Date,
        required: true,
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },

    mobile : {
        type : String,
        required : true,
    },

    city : {
        type : String,
    },

    collegeName : {
        type : String,
        required : true,
    },

    cgpa: {
        type: Number,
        required: true,
    },
    savedScholarships: [
        {
            type: Schema.Types.ObjectId,
            ref: "Scholarship",
        }
    ],

    role: {
        type: String,
        default: "user"
    },

    isbanned: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", UserSchema);