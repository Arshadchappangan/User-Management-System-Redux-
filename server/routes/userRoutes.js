const express = require('express');
const { userSignup, userLogin, userLogout, getUserProfile, uploadProfile } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
const upload = require('../config/multer')


router.post('/signup', userSignup);
router.post('/signin', userLogin);
router.post('/logout', userLogout);
router.post('/profile/upload/:id',protect,upload.single('image'),uploadProfile)
router.get('/user/:id',protect,getUserProfile);



module.exports = router;

