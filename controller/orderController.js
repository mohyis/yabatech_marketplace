const orderModel = require('../models/order');
const staffModel = require('../models/staff')
const paymentModel = require('../models/payment')
const orderId = require('otp-generator');
const date = new Date();
const ready = date.setDate(date.getDate() + 2);
const setReady = new Date(ready);

// endpoint to create schedule for delivery or pickup by customers and admin.

exports.createOrder = async(req,res,next)=>{
    const generatedOrderId = `#SC-${orderId.generate(7, { lowerCase: false, upperCase: false, specialChars: false, alphabets: false, digits: true })}`;

    try {
        const unitPrice = 500;

    const { 
        firstName, 
        lastName, 
        pickUpDate, 
        pickUpTime, 
        email, address, 
        phoneNumber, 
        deliveryMode, 
        paymentMode,
        item, specification, 
        amount, quantity, 
        note } = req.body;
    if(!firstName || !lastName|| !pickUpDate || !pickUpTime || !email || !address || !phoneNumber || !deliveryMode || !item || !specification || !amount || !quantity|| !paymentMode){
        return res.status(400).json({
            message: 'Please fill in all required fields'
        })
    }
    const date = new Date();
    const ready = date.setDate(date.getDate() + 2);
    const setReady = new Date(ready);

    const order = await orderModel.create({
        orderId: generatedOrderId,
        firstName,
        lastName,
        pickUpDate,
        pickUpTime,
        email,
        address,
        phoneNumber,
        deliveryMode,
        paymentMode,
        deliveryDate: setReady,
        item,
        specification,
        quantity,
        amount: unitPrice * quantity,
        bookingDate: new Date(Date.now()),
        readyDate: setReady,
        note
    });
    res.status(201).json({
        message: 'Order Booked successfully',
        data: order
    })

    } catch (error) {
        next(error)
    }
}

// Schedule completed orders for delivery/pickup by assigning staff.

exports.getOrdersWithNoStaffAssigned = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'completed', idStaff: null }) 
        const requiredSchedules = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                deliveryMode: order.deliveryMode,
                deliveryDate: order.deliveryDate,
                deliveryTime: order.deliveryTime,
                status: order.status,
                staffName: order.staffName || 'Not assigned yet'
            }
        })

        res.status(200).json({
            message: 'Completed Orders successfully retrieved for assigning',
            requiredSchedules
        })
    } catch (error) {
        next(error)
    }
};

// assign staff to orders ready for delivery.

exports.assignStaffToOrders = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const orderId = req.params.id
        const { idStaff, staffName, vehicleType, duty } = req.body;

        const order = await orderModel.findOne({ orderId: orderId });
        if (order.status !== 'completed') {
            return res.status(400).json({
                message: 'Only completed orders can be assigned to staff'
            })
        }

        const staff = await staffModel.findOne({ staffId: idStaff });
        if(!staff){
            return res.status(404).json({
                message: 'Staff not found'
            })
        };

        const orderUpdate = {
            adminId: id,
            staffId: staff._id,
            idStaff,    
            staffName: staffName || `${staff.firstName} ${staff.lastName}`,
            vehicleType,
            duty
        };

        const updatedOrder = await orderModel.findOneAndUpdate({ orderId: orderId }, orderUpdate, { new: true });
    
        if (!updatedOrder) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        updatedOrder.deliveryTime = new Date(Date.now());
        await updatedOrder.save();

        res.status(200).json({
            message: 'Staff assigned successfully',
            data: updatedOrder
        });
    } catch (error) {
        next(error);
    }
};


// To get all completed schedules that has been delivered by staff /picked up by customer Or the orders that have been assigned to a staff for delivery/pickup.
exports.getCompletedOrder = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'completed' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                deliveryMode: order.deliveryMode,
                deliveryDate: order.deliveryDate,
                deliveryTime: order.deliveryTime,
                status: order.status,
                staffName: order.staffName
            }
        })

        res.status(200).json({
            message: 'Completed schedules retrieved successfully',
            requiredOrders
         })
    } catch (error) {
        next(error)
    }
};



exports.updateOrderStatus = async(req,res,next)=>{
    try {
        const { status } = req.body
        const {id} = req.user;
        const orderId = req.params.id

        const order = await orderModel.findOneAndUpdate({ orderId: orderId, adminId: id } , { status }, {new: true})
        if(!order){
            return res.status(404).json({   
                message: 'Order not found'
            })
        }

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        })
    } catch (error) {
        next(error)
    }
};

exports.getAllOrders = async(req,res,next)=>{
    try {
        const orders = await orderModel.find()
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status
            }
        })
        res.status(200).json({
            message: 'All orders retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
};

exports.getNewRequests = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'new request' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'New requests retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
}

exports.getInProgress = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'in-progress' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'In-progress orders retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
}

exports.getCompleted = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'completed' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'Completed orders retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
};

exports.getCancelled = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'cancelled' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'Cancelled orders retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
}

exports.getOneOrder = async(req,res,next)=>{
    try {
        const {id} = req.params
        const order = await orderModel.findById(id)
        const payment = await paymentModel.findOne({orderId: id})
        if(!order){
            return res.status(404).json({   
                message: 'Order not found'
            })
        }

        const customer = {
            firstname: order.firstName,
            lastname: order.lastName,
            address: order.pickUpTime,
            phoneNumber: order.phoneNumber,
            email: order.email
        }
        const booking = {
            orderId: order.orderId,
            item: order.item,
            specification: order.specification,
            quantity: order.quantity,
            paymentMode: order.paymentMode,
            readyDate: order.readyDate,
            deliveryMode: order.deliveryMode
        }

        const payments = {
            OrderId: payment.OrderId,
            item: payment.item,
            specification: payment.specification,
            unitPrice: order.unitPrice,
            amount: payment.amount
        }

        res.status(200).json({
            message: 'Order details retrieved successfully',
            customer,
            booking,
            payments
        })
    } catch (error) {
        next(error)
    }
}

 
exports.deleteOrder = async(req,res,next)=>{
    try {
        const {id} = req.user;  
        const orderId = req.params.id
        const order = await orderModel.findOneAndDelete({ orderId: orderId, adminId: id })
        if(!order){
            return res.status(404).json({   
                message: 'Order not found'
            })
        }
        res.status(200).json({
            message: 'Order deleted successfully',
            order
        })
    } catch (error) {
        next(error)
    }
};


exports.allCustomer = async(req, res, next) =>{
    try {
        const customers = await orderModel.find()

        const requiredCustomer = customers.map(customer => {
            return {
                customerId: customer.orderId,
                customerEmail: customer.email,
                customerPhoneNumber: customer.phoneNumber,
                orderAmount: customer.amount,
                amountSpent: customer.amountPaid,
                lastOrder: customer.bookingDate
            }
        })

        res.status(200).json({
            message: 'All customers retrieved successfully',
            requiredCustomer
        })

    } catch (error) {
        next(error)
    }
}
