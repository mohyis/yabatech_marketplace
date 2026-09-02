const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    OrderId: {
        type: String,
    },
    paymentId: {
        type: String,  
        required: true
    },
    item: {
        type: String,
        required: true
    },
    specification: {
        type: String,  
        required: true
    },
    quantity: {
        type: Number,  
        required: true
    },
    amount: {
        type: Number,  
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["cash", "transfer", "pos"],
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    reference: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["successful", "pending", "refunded"],
        required: true
    }
})

const paymentModel = mongoose.model('payment', paymentSchema)

module.exports = paymentModel