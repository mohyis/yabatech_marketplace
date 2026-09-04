const router = require('express').Router();
const { createProduct, updateProduct, updateProductStatus, getAllProducts, getAvailableProducts, getSoldProducts, getTotalAvailableProducts, getTotalSoldProducts, deleteProduct } = require('../controller/productController');
const { createProductValidator, updateProductStatusValidator } = require('../middleware/joiValidation');
const { productRateLimiter } = require('../middleware/rateLimiter');
const  upload  = require('../middleware/multer')


const { checkUser } = require('../middleware/validation');



router.post('/create-product', checkUser, createProductValidator, upload.single('image'), createProduct);
router.put('/product/:id', checkUser, updateProduct);
router.put('/product-status/:productId', checkUser, updateProductStatusValidator, updateProductStatus);
router.get('/all-products', checkUser, getAllProducts);
router.get('/available-products', checkUser, productRateLimiter, getAvailableProducts);
router.get('/sold-products', checkUser, getSoldProducts);
router.get('/total-sold-products', checkUser, getTotalSoldProducts);
router.get('/total-available-products', checkUser, getTotalAvailableProducts);
router.delete('/delete-product/:productId', checkUser, deleteProduct);

module.exports = router;