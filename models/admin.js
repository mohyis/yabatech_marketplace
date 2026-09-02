const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "admin",
        require: true
    },
    // photo: {
    //     url: {
    //         type: String,
    //         require: true
    //     },
    //     public_id: {
    //         type: String,
    //         require: true
    //     }
    // },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
}, { timestamps: true })

const adminModel = mongoose.model('admin', adminSchema)

module.exports = adminModel