// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {hola, login, register} = require('../controller/authController');

router.get('/', hola)
router.post('/register', register);
router.post('/login', login);

module.exports = router;
