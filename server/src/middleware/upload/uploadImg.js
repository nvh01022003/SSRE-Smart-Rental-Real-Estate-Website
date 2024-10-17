const multer = require('multer');
const { User } = require('../../models/user');
const storage = multer.memoryStorage();
const upload = multer({ storage });
// sử dụng cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// check file
const checkFileType = (req, res, next) => {
    const file = req.file;
    // console.log(file)
    if (!file) {
        return res.status(400).json({ err: 1, msg: 'No file uploaded!' });
    }

    // Kiểm tra loại tệp
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());

    if (mimetype && extname) {
        return next();
    } else {
        return res.status(400).json({ err: 1, msg: 'Only image files are allowed' });
    }
};
// check list file
const checkFileTypePost = (req, res, next) => {
    const files = req.files;
    console.log(files)
    if (!files || files.length === 0) {
        return res.status(400).json({ err: 1, msg: 'No file uploaded' });
    }

    // Kiểm tra loại tệp cho từng file
    const filetypes = /jpeg|jpg|png|gif/;
    for (let file of files) {
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());

        if (!mimetype || !extname) {
            return res.status(400).json({ err: 1, msg: 'Only image files are allowed' });
        }
    }

    return next();
};
// UPDATE IMG
const updateImg = async (req, res, next) => {
    try {
        const file = req.file;
        // Upload ảnh lên Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(file.buffer);
        });

        // add link ảnh vào req
        req.body.img_avt = result.secure_url;
        console.log('Avatar uploaded successfully:', result.secure_url);
        next();
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ err: 1, msg: 'Failed to upload avatar' });
    }
};
// UPDATE IMG POST
const updateImgs = async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ err: 1, msg: 'No file uploaded!' });
        }

        const uploadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }).end(file.buffer);
            });
        });

        const imageUrls = await Promise.all(uploadPromises);
        req.body.imageUrls = imageUrls;
        next();
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ err: 1, msg: 'Failed to upload images' });
    }
};
module.exports = { updateImg, upload, checkFileType, checkFileTypePost, updateImg, updateImgs };