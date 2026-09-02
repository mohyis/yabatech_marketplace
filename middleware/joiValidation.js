const joi = require('joi')


exports.registerValidator = (req, res, next) => {
    const schema = joi.object({
        firstName: joi.string().pattern(/^[a-zA-Z]{3,}$/).required().messages({
            'any.required': 'First name is required',
            'string.empty': 'First name cannot be empty',
            'string.pattern.base': 'First name cannot contain digits or whitespace and must be a minimum of 3 characters'
        }),
        lastName: joi.string().pattern(/^[a-zA-Z]{3,}$/).required().messages({
            'any.required': 'Last name is required',
            'string.empty': 'Last name cannot be empty',
            'string.pattern.base': 'Last name cannot contain digits or whitespace and must be a minimum of 3 characters'
        }),
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be a minimum of 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
        }),
        confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
            'any.required': 'Confirm password is required',
            'string.empty': 'Confirm password cannot be empty',
            'any.only': 'Passwords do not match'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.loginValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be a minimum of 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}



exports.createOrderValidator = (req, res, next) => {
    const schema = joi.object({
        firstName: joi.string().pattern(/^[a-zA-Z]{2,}$/).required().messages({
            'any.required': 'First name is required',
            'string.empty': 'First name cannot be empty',
            'string.pattern.base': 'First name cannot contain digits or whitespace and must be at least 2 characters'
        }),
        lastName: joi.string().pattern(/^[a-zA-Z]{2,}$/).optional().allow('').messages({
            'string.pattern.base': 'Last name cannot contain digits or whitespace and must be at least 2 characters'
        }),
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),
        phoneNumber: joi.string().pattern(/^\+?[0-9]{11,14}$/).required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must be a valid number between 11 and 14 digits'
        }),
        address: joi.string().min(5).required().messages({
            'any.required': 'Address is required',
            'string.empty': 'Address cannot be empty',
            'string.min': 'Address must be at least 5 characters'
        }),
        pickUpDate: joi.date().min('now').required().messages({
            'any.required': 'Pick-up date is required',
            'date.base': 'Pick-up date must be a valid date',
            'date.greater': 'Pick-up date must be a future date'
        }),
        pickUpTime: joi.string().required().messages({
            'any.required': 'Pick-up time is required',
            'string.empty': 'Pick-up time cannot be empty'
        }),
        deliveryMode: joi.string().valid('delivery', 'pickup').required().messages({
            'any.required': 'Delivery mode is required',
            'string.empty': 'Delivery mode cannot be empty',
            'any.only': 'Delivery mode must be either delivery or pickup'
        }),
        paymentMode: joi.string().valid('online', 'cash', 'transfer').required().messages({
            'any.required': 'Payment mode is required',
            'string.empty': 'Payment mode cannot be empty',
            'any.only': 'Payment mode must be one of online, cash, or transfer'
        }),
        item: joi.string().optional().allow('').messages({
            'string.base': 'Item must be a string'
        }),
        specification: joi.string().optional().allow('').messages({
            'string.base': 'Specification must be a string'
        }),
        quantity: joi.number().integer().min(1).optional().messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity must be at least 1'
        }),
        amount: joi.number().min(0).optional().messages({
            'number.base': 'Amount must be a number',
            'number.min': 'Amount cannot be negative'
        }),
        note: joi.string().optional().allow('').messages({
            'string.base': 'Note must be a string'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
};

exports.updateOrderStatusValidator = (req, res, next) => {
    const schema = joi.object({
        status: joi.string().valid('new request', 'in-progress', 'completed', 'cancelled').required().messages({
            'any.required': 'Status is required',
            'string.empty': 'Status cannot be empty',
            'any.only': 'Status must be one of: new request, in-progress, completed, or cancelled'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
};

exports.createMessageValidator = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(2).required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name must be at least 2 characters'
        }),
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),
        subject: joi.string().min(3).max(150).required().messages({
            'any.required': 'Subject is required',
            'string.empty': 'Subject cannot be empty',
            'string.min': 'Subject must be at least 3 characters',
            'string.max': 'Subject cannot exceed 150 characters'
        }),
        message: joi.string().min(10).max(1000).required().messages({
            'any.required': 'Message is required',
            'string.empty': 'Message cannot be empty',
            'string.min': 'Message must be at least 10 characters',
            'string.max': 'Message cannot exceed 1000 characters'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
};

exports.createStaffValidator = (req, res, next) => {
    const schema = joi.object({
        firstName: joi.string().pattern(/^[a-zA-Z]{2,}$/).required().messages({
            'any.required': 'First name is required',
            'string.empty': 'First name cannot be empty',
            'string.pattern.base': 'First name cannot contain digits or whitespace and must be at least 2 characters'
        }),
        lastName: joi.string().pattern(/^[a-zA-Z]{2,}$/).required().messages({
            'any.required': 'Last name is required',
            'string.empty': 'Last name cannot be empty',
            'string.pattern.base': 'Last name cannot contain digits or whitespace and must be at least 2 characters'
        }),
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),
        phoneNumber: joi.string().pattern(/^\+?[0-9]{11,14}$/).required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must be a valid number between 11 and 14 digits'
        }),
        address: joi.string().min(5).required().messages({
            'any.required': 'Address is required',
            'string.empty': 'Address cannot be empty',
            'string.min': 'Address must be at least 5 characters'
        }),
        position: joi.string().required().messages({
            'any.required': 'Position is required',
            'string.empty': 'Position cannot be empty'
        }),
        bscScience: joi.string().optional().allow('').messages({
            'string.base': 'BSc Science must be a string'
        }),
        schoolAttended: joi.string().optional().allow('').messages({
            'string.base': 'School attended must be a string'
        }),
        professionalCerts: joi.string().optional().allow('').messages({
            'string.base': 'Professional certifications must be a string'
        }),
        guarantorFirstName: joi.string().pattern(/^[a-zA-Z]{2,}$/).optional().messages({
            'string.empty': 'Guarantor first name cannot be empty',
            'string.pattern.base': 'Guarantor first name cannot contain digits or whitespace and must be at least 2 characters'
        }),
        guarantorLastName: joi.string().pattern(/^[a-zA-Z]{2,}$/).optional().messages({
            'string.empty': 'Guarantor last name cannot be empty',
            'string.pattern.base': 'Guarantor last name cannot contain digits or whitespace and must be at least 2 characters'
        }),
        guarantorEmail: joi.string().email().optional().messages({
            'string.empty': 'Guarantor email cannot be empty',
            'string.email': 'Invalid guarantor email format'
        }),
        guarantorPhoneNumber: joi.string().pattern(/^\+?[0-9]{7,15}$/).optional().messages({
            'any.required': 'Guarantor phone number is required',
            'string.empty': 'Guarantor phone number cannot be empty',
            'string.pattern.base': 'Guarantor phone number must be a valid number between 7 and 15 digits'
        }),
        guarantorAddress: joi.string().min(5).optional().messages({
            'string.empty': 'Guarantor address cannot be empty',
            'string.min': 'Guarantor address must be at least 5 characters'
        }),
        relationship: joi.string().optional().messages({
            'string.empty': 'Relationship cannot be empty'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

