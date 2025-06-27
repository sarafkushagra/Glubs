const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/users', userController.showAllUsers);
router.get('/users/:id', userController.showUser);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;

