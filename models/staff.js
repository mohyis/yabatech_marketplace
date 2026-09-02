const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    staffId: {
        type: String,
        unique: true
    },
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
    address: {
        type: String,
        require: true
    },
    employmentDate: {
        type: Date,
        require: true
    },
    position: {
        type: String,
        enum: ["receptionist", "driver"],
        default: "receptionist",
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ["on-duty", "off-duty"],
    },
    bscScience: {
        type: String,
    },
    schoolAttended: {
        type: String,
    },
    professionalCerts: {
        type: String,
    },
    guarantorFirstName: {
        type: String,
    },
    guarantorLastName: {
        type: String,
    },
    guarantorAddress: {
        type: String,
    },
    relationship: {
        type: String,
    },
    guarantorPhoneNumber: {
        type: String,
    },
    guarantorEmail: {
        type: String,
    }
}, {timestamps: true})

const staffModel = mongoose.model('staff', staffSchema)

module.exports = staffModel