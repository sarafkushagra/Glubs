const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/login', userController.showLoginForm);
router.get('/', userController.showAllUsers);
router.get('/:id', userController.showUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

