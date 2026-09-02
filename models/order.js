const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
    },
    orderId: {
        type: String,  
        required: true
    },
    firstName: {
        type: String,  
        required: true
    },
    lastName: {
        type: String,  
        required: true
    },
    pickUpDate: {
        type: String,
        required: true
    },
    pickUpTime: {
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
    phoneNumber: {
        type: String,
        require: true
    },
    item: {
        type: String,  
        required: true
    },
    specification: {
        type: String,  
        required: true
    },
    unitPrice: {
        type: Number,
        default: 500,
        required: true
    },
    amount: {
        type: Number,  
        required: true
    },
    amountPaid: {
        type: Number
    },
    quantity: {
        type: Number,  
        required: true
    },
    deliveryDate: {
        type: Date,
        require: true
    },
    deliveryTime: {
        type: String
    },
    deliveryMode: {
        type: String,
        enum: ['pickup', 'delivery'],
        require: true
    },
    paymentMode: {
        type: String,
        enum: ["cash", "transfer", "pos"]
    },
    bookingDate: {
        type: Date,
        required: true
    },
    readyDate: {
        type: Date,
    },
    note: {
       type: String,
    },
    status: {
        type: String,
        enum: ["new request", "in-progress", "completed", "cancelled"],
        default: "new request",
        required: true
    },
    staffName: {
        type: String,
    },
    idStaff: {
        type: String,
    },
    vehicleType: {
        type: String,
    },
    duty: {
        type: String,
    }
})

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel