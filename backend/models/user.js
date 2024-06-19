const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 4,
        maxLength: 30
    },
    firstName: {
        type: String,
        require: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        require: true,
        trim: true,
        maxLength: 50
    },
    password:{
        type: String,
        require: true,
        minLength: 6
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User