const staffModel = require('../models/staff');
const bcrypt = require('bcrypt')
const otp = require('otp-generator')
const generatedStaffId = `#SCS-${otp.generate(6, { 
    lowerCase: false, upperCase: true, 
    specialChars: false, 
    alphabets: true, 
    digits: true })}-${Math.floor(Math.random() * 100)}`;


exports.createStaff = async (req, res) => {
    try {
        const {id} = req.user;
        const { 
            firstName, lastName, 
            email, phoneNumber, address, 
            position, bscScience, 
            schoolAttended, professionalCerts, 
            guarantorFirstName, guarantorLastName, 
            guarantorEmail, guarantorPhoneNumber, 
            guarantorAddress, relationship } = req.body;

        const existingStaff = await staffModel.findOne({ email: email.toLowerCase() });

        if (existingStaff) {
            return res.status(400).json({
                message: 'Staff already exist'
            })
        };

        const staff = await staffModel.create({
            adminId: id,
            staffId: generatedStaffId,
            firstName,
            lastName,
            email,
            address,
            position,
            employmentDate: new Date(Date.now()),
            phoneNumber,
            bscScience,
            schoolAttended,
            professionalCerts,
            guarantorFirstName,
            guarantorLastName,
            guarantorEmail,
            guarantorPhoneNumber,
            guarantorAddress,
            relationship
        });

        res.status(201).json({
            message: 'Staff created successfully',
            data: staff
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


exports.getAllStaff = async (req, res) => {
    try {
        const staffs = await staffModel.find();
        const staffList = staffs.map(staff => ({
            PERSONAL_INFO: {
                firstName: staff.firstName, 
                lastName: staff.lastName, 
                email: staff.email, 
                phoneNumber: staff.phoneNumber, 
                address: staff.address, 
                position: staff.position
            },
            EDUCATION_CREDENTIALS: {
                bscScience: staff.bscScience, 
                schoolAttended: staff.schoolAttended, 
                professionalCerts: staff.professionalCerts
            },
            GUARANTOR_INFO: {
                firstName: staff.guarantorFirstName, 
                lastName: staff.guarantorLastName, 
                email: staff.guarantorEmail, 
                phoneNumber: staff.guarantorPhoneNumber, 
                address: staff.guarantorAddress, 
                relationship: staff.relationship
            }
        }));

        res.status(200).json({
            message: 'All staffs retrieved successfully',
            data: staffList
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


exports.getOneStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffModel.findById(id);

        if (!staff) {
            return res.status(404).json({
                message: 'Staff not found'
            })
        };
        const data = {
             PERSONAL_INFO: {
                firstName: staff.firstName, 
                lastName: staff.lastName, 
                email: staff.email, 
                phoneNumber: staff.phoneNumber, 
                address: staff.address, 
                position: staff.position
            },
            EDUCATION_CREDENTIALS: {
                bscScience: staff.bscScience, 
                schoolAttended: staff.schoolAttended, 
                professionalCerts: staff.professionalCerts
            },
            GUARANTOR_INFO: {
                firstName: staff.guarantorFirstName, 
                lastName: staff.guarantorLastName, 
                email: staff.guarantorEmail, 
                phoneNumber: staff.guarantorPhoneNumber, 
                address: staff.guarantorAddress, 
                relationship: staff.relationship
            }
        }

        res.status(200).json({
            message: 'staff retrieved successfully',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phoneNumber, address, position, status } = req.body;
        const staff = await staffModel.findById(id);        
        if (!staff) {
            return res.status(404).json({
                message: 'Staff not found'
            })
        };

        staff.firstName = firstName || staff.firstName; 
        staff.lastName = lastName || staff.lastName;
        staff.email = email || staff.email;
        staff.phoneNumber = phoneNumber || staff.phoneNumber;
        staff.address = address || staff.address;
        staff.position = position || staff.position;
        staff.status = status || staff.status;

        const updatedStaff = await staff.save();

        res.status(200).json({
            message: 'Staff updated successfully',
            data: updatedStaff
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffModel.findByIdAndDelete(id);

        if (!staff) {
            return res.status(404).json({
                message: 'Staff not found'
            })
        }

        res.status(200).json({
            message: 'Staff deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};
