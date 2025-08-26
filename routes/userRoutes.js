// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {getLogin, getRegister, postLogin, postRegister} = require('../controller/userController');

// Formularios
router.get('/login', getLogin);
router.get('/register', getRegister);

// Procesar formularios
router.post('/login', postLogin);
router.post('/register', postRegister);

module.exports = router;
