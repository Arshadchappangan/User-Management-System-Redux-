const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.send('<h1>User Home Page</h1>');
})

router.post('/signup', userSignup);
router.post('/login', userLogin);



module.exports = router;