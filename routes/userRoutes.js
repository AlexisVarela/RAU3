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
// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('login');
    });
});

module.exports = router;
