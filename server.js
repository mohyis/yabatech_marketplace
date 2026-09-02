require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const cors = require('cors')
const redisClient = require('./redisConfig/redis')
const expressSession = require('express-session')
const app = express()
const PORT = 5907
require('./controller/googleAuth')

// const allowedOrigins = ['http://localhost:5177', 'https://spin-cycle.onrender.com'];
app.use(cors());

const adminRouter = require('./router/adminRouter')
const orderRouter = require('./router/orderRouter')
const staffRouter = require('./router/staffRouter')
const messageRouter = require('./router/messageRouter')
const paymentRouter = require('./router/paymentRouter')
const dashboardRouter = require('./router/dashboardRouter')


app.use(express.json())
app.use(expressSession({secret: "mohyis", saveUninitialized: false, resave: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api/admin', adminRouter)
app.use('/api/order', orderRouter)
app.use('/api/staff', staffRouter)
app.use('/api/message', messageRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/dashboard', dashboardRouter)
// app.use((req, res , next)=>{
//     res.status(500).json({
//         message: `route ${req.originalUrl} and ${req.method} not found`
//     })
// })

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Spin Cycle Laundry Service API',
        version: '2.0.0',
        description: 
            `This is a REST API application made with Express. It retrieves data from JSONPlaceholder.
             The base URL is: https://spin-cycle.onrender.com`,
        license: {
            name: 'Official URL',
            url: 'https://google.com',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'https://spin-cycle.onrender.com',
            description: 'development server',
        },
    ],
    security: [
        {
            bearerAuth: []
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./router/*.js']
}

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/admin/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} and ${req.method} not found`,
        status: 404
    })
})

// Global error handler - must be last middleware with 4 parameters
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    
    console.error('Error:', error); // Log error for debugging
    
    res.status(statusCode).json({
        message: message,
        status: statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
})

mongoose.connect(process.env.DB_URI).then(()=>{
    redisClient.connect().then(()=>{
    console.log('redis client connected successfully')
}).catch((err)=>{
    console.log('redis client connection error', err)
})
    console.log('database connected successfully'),
     app.listen(PORT, ()=>{
    console.log('app is listening to port', PORT)
})}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
})


