const productModel = require('../models/product');
const userModel = require('../models/user');
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

exports.createProduct = async (req, res, next) => {
  let fileDeleted = false;

  try {
    const { id } = req.user;
    const { productName, category, condition, price, description, phoneNumber } = req.body;

    if (!productName || !category || !condition || !price || !description || !phoneNumber) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    let uploadResult;
    if (req.file) {
      uploadResult = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      fileDeleted = true;
    }

    const product = await productModel.create({
      userId: id,
      productName,
      category,
      condition,
      price,
      description,
      image: uploadResult?.secure_url,
      imagePublicId: uploadResult?.public_id,
      phoneNumber
    });

    res.status(201).json({ 
        message: 'Product created successfully', 
        data: product 
    });
  } catch (error) {
    if (req.file?.path && !fileDeleted && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;
    const product = await productModel.findOne({ where: { id: productId, userId: id } });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;

    const {
      productName,
      category,
      condition,
      price,
      description,
      phoneNumber,
      status
    } = req.body;

    const product = await productModel.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    let uploadResult;
    if (req.file) {
      uploadResult = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    const updatedProduct = await productModel.update({
      productName,
      category,
      condition,
      price,
      description,
      image: uploadResult?.secure_url,
      imagePublicId: uploadResult?.public_id,
      phoneNumber,
      status
    }, { where: { id: productId, userId: id } });

    res.status(200).json({
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProductStatus = async(req,res,next)=>{
    try {
        const { status } = req.body
        const {id} = req.user;
        const productId = req.params.id

        const product = await productModel.findByPk(productId)
        if(!product){
            return res.status(404).json({   
                message: 'Product not found'
            })
        }

        const updatedProduct = await productModel.update({ status }, { where: { id: productId, userId: id } })

        res.status(200).json({
            message: 'Product status updated successfully',
        })
    } catch (error) {
        next(error)
    }
};

exports.getAllProducts = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const products = await productModel.findAll({ where: { userId: id } })
        const requiredProducts = products.map(product => {
            return {
                id: product.id,
                productName: product.productName,
                category: product.category,
                condition: product.condition,
                price: product.price,
                description: product.description,
                image: product.image,
                phoneNumber: product.phoneNumber,
                status: product.status
            }
        })

        res.status(200).json({
            message: 'All products retrieved successfully',
            requiredProducts
        })

    } catch (error) {
        next(error)
    }
};

exports.getProductMarketPlaceById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findOne({ where: { id: productId }, include: [{
      model: userModel,
      as: 'user',
      attributes: ['firstName', 'lastName', 'department', 'phoneNumber']
    }] });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};


exports.getMarketPlaceProducts = async (req, res, next) => {
    try {
        const products = await productModel.findAll({
            where: { status: 'available' },
            include: [{
                model: userModel,
                as: 'user',
                attributes: ['firstName', 'lastName', 'department', 'phoneNumber']
            }]
        });

        const requiredProducts = products.map(product => {
            return {
                id: product.id,
                productName: product.productName,
                category: product.category,
                condition: product.condition,
                price: product.price,
                description: product.description,
                image: product.image,
                phoneNumber: product.phoneNumber,
                status: product.status,
                user: product.user ? {
                    fullName: `${product.user.firstName} ${product.user.lastName}`,
                    department: product.user.department,
                    phoneNumber: product.user.phoneNumber
                } : null
            };
        });

        res.status(200).json({
            message: 'All market place products retrieved successfully',
            requiredProducts
        });

    } catch (error) {
        next(error);
    }
};

exports.getAvailableProducts = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const products = await productModel.findAll({ where: { userId: id, status: 'available' } })
        const requiredProducts = products.map(product => {
            return {
                id: product.id,
                productName: product.productName,
                category: product.category,
                condition: product.condition,
                price: product.price,
                description: product.description,
                image: product.image,
                phoneNumber: product.phoneNumber,
                status: product.status
            }
        })
        res.status(200).json({
            message: 'Available products retrieved successfully',
            requiredProducts
        })
    } catch (error) {
        next(error)
    }
}

exports.getSoldProducts = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const products = await productModel.findAll({ where: { userId: id, status: 'completed' } })
        const requiredProducts = products.map(product => {
            return {
                id: product.id,
                productName: product.productName,
                category: product.category,
                condition: product.condition,
                price: product.price,
                description: product.description,
                image: product.image,
                phoneNumber: product.phoneNumber,
                status: product.status
            }
        })
        res.status(200).json({
            message: 'Sold products retrieved successfully',
            requiredProducts
        })
    } catch (error) {
        next(error)
    }
}


exports.getTotalSoldProducts = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const totalSoldProducts = await productModel.count({ where: { userId: id, status: 'sold' } })
               
        res.status(200).json({
            message: 'Total sold products retrieved successfully',
            totalSoldProducts
        })
    } catch (error) {
        next(error)
    }
}

exports.getTotalAvailableProducts = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const totalAvailableProducts = await productModel.count({ where: { userId: id, status: 'available' } })
        
        res.status(200).json({
            message: 'Total available products retrieved successfully',
            totalAvailableProducts
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteProduct = async(req,res,next)=>{
    try {
        const {id} = req.user;  
        const productId = req.params
        const product = await productModel.findOne({ where: { id: productId, userId: id } })
        if(!product){
            return res.status(404).json({   
                message: 'Product not found'
            })
        }
        await product.destroy()
        res.status(200).json({
            message: 'Product deleted successfully',
            product
        })
    } catch (error) {
        next(error)
    }
};
