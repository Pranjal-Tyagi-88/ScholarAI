const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema ({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    scholarship : {
        type : Schema.Types.ObjectId,
        ref : "Scholarship",
        required : true,
    },
    
    appliedAt : {
        type : Date,
        default : Date.now ,
    }

});

module.exports = mongoose.model("Application" , applicationSchema);