const express = require('express');
require('dotenv').config();
require('./config/config')
const sequelize = require('./database/database')
const mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const cors = require('cors')
const redisClient = require('./config/redis')
const app = express()
const PORT = 2000
const morgan = require('morgan')

// const allowedOrigins = ['http://localhost:5177', 'https://spin-cycle.onrender.com'];
app.use(cors());

const userRouter = require('./router/userRouter')
const productRouter = require('./router/productRouter')
    
app.use(morgan('dev'));
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
// app.use((req, res , next)=>{
//     res.status(500).json({
//         message: `route ${req.originalUrl} and ${req.method} not found`
//     })
// })

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'YabaTech MarketPlace API',
        version: '2.0.0',
        description: 
            `This is a REST API application made with Express. It retrieves data from JSONPlaceholder.
             The base URL is:https://yabatech-marketplace-8cv3.onrender.com`,
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
            url: 'https://yabatech-marketplace-8cv3.onrender.com',
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
    apis: ['./router/swaggerDocs.js']
}

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/user/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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

// mongoose.connect(process.env.DB_URI).then(()=>{
//     redisClient.connect().then(()=>{
//     console.log('redis client connected successfully')
// }).catch((err)=>{
//     console.log('redis client connection error', err)
// })
//     console.log('database connected successfully'),
//      app.listen(PORT, ()=>{
//     console.log('app is listening to port', PORT)
// })}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
// })


const database = async () => {
    try {
        await sequelize.authenticate();
        console.log('database connected successfully');

        await redisClient.connect();    
        console.log('redis client connected successfully');

        app.listen(PORT, () => {
            console.log(`server listening to port, ${PORT}`);
        });
    } catch (error) {
        console.log('Connection error:', error.message);
    }
};

database();
