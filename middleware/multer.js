// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads')
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
//         cb(null, 'IMG_' + uniqueSuffix + '.' + file.mimetype.split("/")[1])
//     }
// });

// const limits = {
//     fileSize: 1024 * 1024 * 12
// };

// const fileFilter = (req, file, cb) => {
//     console.log(file);
//     if (!file.mimetype.startsWith('image/')) {
//         cb(new Error('Only image files are allowed'))
//     } else {
//         cb(null, true)
//     }
// }

// const upload = multer({
//     storage,
//     limits,
//     fileFilter
// });

// module.exports = {
//     upload
// }