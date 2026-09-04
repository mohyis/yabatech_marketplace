const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const redisClient = require('../config/redis')
const { sendBrevoEmail } = require('../utils/brevo')
const { signupTemplate } = require('../utils/emailTemplate')
const { forgotPasswordTemplate } = require('../utils/emailTemplate')
const otpGenerator = require('otp-generator')


exports.register = async (req, res, next) => {
   
    try {

        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        const file = req.file;
        const { firstName, lastName, matricNumber, department, level, email, phoneNumber, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'password does not match'
            })
        }

        const existingEmail = await userModel.findOne({ where: { email: email } });
         if (existingEmail) {
                 return res.status(409).json({ 
                     message: 'email already in use' 
                 });
             
         }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userModel.create({
            firstName,
            lastName,
            matricNumber,
            department,
            level,
            email,
            phoneNumber,
            password: hashedPassword,
        })

         const emailOptions = {
                    email: user.email,
                    subject: 'Welcome To Campus Digital MarketPlace',
                    html: signupTemplate(user.firstName, OTP)
                }
        
                await sendBrevoEmail(emailOptions)

        const data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

        res.status(201).json({
            message: 'account created',
            data
        })

    } catch (error) {
       next(error)
    }
}

exports.updateUser = async(req,res,next)=>{
    try {
        const { id } = req.user;
        const { firstName, lastName, matricNumber, department, level, email, phoneNumber } = req.body;

        const user = await userModel.findByPk(id);
        if (!user) {
            return next({
                message: 'user not found',
                statusCode: 404
            });
        }

        await userModel.update(
            { firstName, lastName, matricNumber, department, level, email, phoneNumber },
            { where: { id: id } }
        );

        res.status(200).json({
            message: 'User updated successfully',
            data: {
                firstName,
                lastName,
                matricNumber,
                department,
                level,
                email,
                phoneNumber
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async(req, res, next)=>{

    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ where: { email: email } })

        if(!user){
            return next({
        message: 'user not found',
        statusCode: 404
      })
        };
        if (new Date()> user.otpExpiresAt || user.otp != otp){
            return next({
                message: 'Invalid OTP',
                statusCode: 400
            })

        }

        await userModel.update({ isVerified: true, otp: null, otpExpiresAt: null }, { where: { id: user.id } })

        res.status(200).json({
            message: 'Verification successful',
            email: user.email

        })

    } catch (error) {
       next(error)
    }
};

exports.resendOTP = async(req,res,next)=>{
    const { email } = req.body;
    const user = await userModel.findOne({ where: { email: email } })
    
    if(!user){
        return next({
        message: 'invalid credentials', 
        statusCode: 404
      })
        };

    const OTP = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
    const expiresAt = new Date(Date.now() + 2 * 60000);
    
    await userModel.update({ otp: OTP, otpExpiresAt: expiresAt }, { where: { id: user.id } })

    const emailOptions = {
        email: user.email,
        subject: 'Confirm New OTP',
        html: signupTemplate(user.firstName, OTP)
    }

    await sendBrevoEmail(emailOptions)

        res.status(200).json({
            message: 'OTP sent successfully',
            email: user.email
    
        })
};

exports.forgotPassword = async(req,res,next)=>{
    const { email } = req.body;
    const user = await userModel.findOne({ where: { email: email } })

        if(!user){
          return next({
        message: 'invalid credentials',
        statusCode: 404
      })
        };

        const OTP = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 2 * 60000);
        
        await userModel.update({ otp: OTP, otpExpiresAt: expiresAt }, { where: { id: user.id } })

        const emailOptions = {
            email: user.email,
            subject: 'Reset Your Password',
            html: forgotPasswordTemplate(user.firstName, OTP)
        }
        
        await sendBrevoEmail(emailOptions)
        
        res.status(200).json({
            message: 'OTP sent successfully',
            
        })
        
};

    exports.verifyForgotPassword = async(req,res,next)=>{

    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ where: { email: email } })

        if(!user){
            return next({
        message: 'user not found',
        statusCode: 404
      })
        };
        if (new Date()> user.otpExpiresAt || user.otp != otp){
            return next({
                message: 'Invalid OTP',
                statusCode: 400
            })

        };

        await userModel.update({ isVerified: true, otp: null, otpExpiresAt: null, passwordReset: true }, { where: { id: user.id } })

        res.status(200).json({
            message: 'Verification successfully',
        })

    } catch (error) {
       next(error)
    }
};

exports.resetPassword = async(req,res,next)=>{

    try {
        
        const { email, newPassword, confirmPassword } = req.body;
        const user = await userModel.findOne({ where: { email: email } })

        if(!user){
            return next({
        message: 'user not found',
        statusCode: 404
      })
        };

        if(user.passwordReset === false){
            return next({
                message: 'Unauthorized to perform this action',
                statusCode: 403
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'password does not match'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await userModel.update({ password: hashedPassword }, { where: { id: user.id } })

        res.status(200).json({
            message: 'Password Reset successfully',
        })

    } catch (error) {
       next(error)
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ where: { email: email } })
        if (!user) {
            return next({
                message: 'user not found',
                statusCode: 404
            })
        };

            if(user.isVerified == false){
                return next({
            message: 'please verify your email', 
            statusCode: 400
          })

         }
       

        // check if account is locked due to many failed login attempts

        if( user.lockUntil > Date.now()) {
            return next({
                message: `Account locked until ${user.lockUntil}`,
                statusCode: 403
            })
        }

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (!passwordCorrect) {
            // increment login attempt and lock account if necessary

            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 2 * 60000);
                user.loginAttempts = 0
            }

            await userModel.update({ loginAttempts: user.loginAttempts, lockUntil: user.lockUntil }, { where: { id: user.id } })
            
            return next({
                message: 'invalid credentials',
                statusCode: 400
            })
        }

        // reset login attempts on successful login
        user.loginAttempts = 0;
        await userModel.update({ loginAttempts: 0, lockUntil: null }, { where: { id: user.id } })

        const token = await jwt.sign({
            id: user.id, email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: '1 day' })
            
            redisClient.del(`user: ${user.id}`)
            redisClient.set(`user: ${user.id}`, token, {EX: 86400})

            const data = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

        res.status(200).json({
            message: 'login successfully',
            data,
            token
        })

    } catch (error) {
        next(error)
    }
};

exports.logout = async(req, res, next)=>{
    try {
        // get the token from the request header
        const {id} = req.user
        // delete the token from redis to invalidate the session
        redisClient.del(`user:${id}`)

        res.status(200).json({
            message: 'logout successful'
        })
    } catch (error) {
        next(error)
    }
}
