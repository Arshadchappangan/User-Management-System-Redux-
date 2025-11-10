const express = require('express');
const { userSignup, userLogin, userLogout, getUserProfile } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/',(req,res) => {
    res.send('<h1>User Home Page</h1>');
})

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.get('/profile',protect,getUserProfile);



module.exports = router;

