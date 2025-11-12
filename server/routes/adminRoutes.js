const express = require('express');
const protect = require('../middlewares/authMiddleware');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');
const router = express.Router();



router.get('/dashboard',protect,getUsers);
router.post('/create-user',protect,createUser);
router.put('/edit-user/:id',protect,updateUser)
router.delete('/delete-user/:id',protect,deleteUser);


module.exports = router;