// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Formularios
router.get('/login', userController.getLogin);
router.get('/register', userController.getRegister);

// Procesar formularios
router.post('/login', userController.postLogin);
router.post('/register', userController.postRegister);

module.exports = router;
