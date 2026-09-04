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
        matricNumber: joi.string().pattern(/^[a-zA-Z0-9]{6,}$/).required().messages({
            'any.required': 'Matric number is required',
            'string.empty': 'Matric number cannot be empty',
        }),
        department: joi.string().pattern(/^[a-zA-Z]{3,}$/).required().messages({
            'any.required': 'Department is required',
            'string.empty': 'Department cannot be empty',
        }),
        level: joi.string().pattern(/^[a-zA-Z0-9]{1,}$/).required().messages({
            'any.required': 'Level is required',
            'string.empty': 'Level cannot be empty',
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

exports.updateUserValidator = (req, res, next) => {
    const schema = joi.object({
        firstName: joi.string().pattern(/^[a-zA-Z]{3,}$/).messages({
            'string.pattern.base': 'First name must contain only letters and be at least 3 characters long'
        }),
        lastName: joi.string().pattern(/^[a-zA-Z]{3,}$/).messages({
            'string.pattern.base': 'Last name must contain only letters and be at least 3 characters long'
        }),
        department: joi.string().pattern(/^[a-zA-Z]{3,}$/).messages({
            'string.pattern.base': 'Department must contain only letters and be at least 3 characters long'
        }),
        level: joi.string().pattern(/^[a-zA-Z0-9]{1,}$/).messages({
            'string.pattern.base': 'Level must contain only letters and numbers and be at least 1 character long'
        }),
        email: joi.string().email().messages({
            'string.email': 'Invalid email format'
        }),
        phoneNumber: joi.string().pattern(/^\+?[0-9]{11,14}$/).messages({
            'string.pattern.base': 'Phone number must be a valid number between 11 and 14 digits'
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



exports.createProductValidator = (req, res, next) => {
    const schema = joi.object({
        productName: joi.string().pattern(/^[a-zA-Z]{2,}$/).required().messages({
            'any.required': 'Product name is required',
            'string.empty': 'Product name cannot be empty',
            'string.pattern.base': 'Product name cannot contain digits or whitespace and must be at least 2 characters'
        }),
        category: joi.string().required().messages({
            'any.required': 'Category is required',
            'string.empty': 'Category cannot be empty'
        }),
        condition: joi.string().valid('new', 'used').required().messages({
            'any.required': 'Condition is required',
            'string.empty': 'Condition cannot be empty',
        }),
        price: joi.number().positive().required().messages({
            'any.required': 'Price is required',
            'number.empty': 'Price cannot be empty',
            'number.positive': 'Price must be a positive number'
        }),
        description: joi.string().min(10).max(200).required().messages({
            'any.required': 'Description is required',
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 200 characters'
        }),
        image: joi.string().required().messages({
            'any.required': 'Image is required',
            'string.empty': 'Image cannot be empty'
        }),
        phoneNumber: joi.string().pattern(/^\+?[0-9]{11,14}$/).required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must be a valid number between 11 and 14 digits'
        }),
        status: joi.string().valid('available', 'sold').required().messages({
            'any.required': 'Status is required',
            'string.empty': 'Status cannot be empty',
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

exports.updateProductStatusValidator = (req, res, next) => {
    const schema = joi.object({
        status: joi.string().valid('available', 'sold').required().messages({
            'any.required': 'Status is required',
            'string.empty': 'Status cannot be empty',
            'any.only': 'Status must be one of: available, sold'
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
