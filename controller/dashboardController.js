const adminModel = require('../models/admin')
const orderModel = require('../models/order')

exports.dashboard = async(req, res, next)=>{
    try {
        const {id} = req.user
        const order = await orderModel.find()
        const inProgress = await orderModel.find({status: 'in-progress'})
        const completed = await orderModel.find({status: 'completed'})

        const totalOrders = order.length
        const totalInProgress = inProgress.length
        const totalCompleted = completed.length

        const totalRevenue = order.reduce((sum, item) => sum + item.amount, 0)

        const latestOrder = order.map(all =>({
            orderId: all.orderId,
            amount: all.amount,
            paymentMode: all.paymentMode,
            bookingDate: all.bookingDate,
            deliveryDate: all.deliveryDate,
            deliveryMode: all.deliveryMode,
            status: all.status

        }))

        const admin = await adminModel.findById(id)
            const data = {
                adminName: admin.firstName
            }

            res.status(200).json({
                message: `welcome back ${data.adminName}`,
                data,
                totalOrders,
                totalInProgress,
                totalCompleted,
                totalRevenue,
                latestOrder
            })
        
    } catch (error) {
        next(error)
    }
};