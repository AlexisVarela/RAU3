const express = require('express');
const passport = require('passport');
const router = express.Router();

const oauthController = require('../controllers/oauthController');
const { authJWT } = require('../middleware/auth');

// Rutas de OAuth con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  oauthController.googleCallback
);

// Ruta para obtener usuario después de OAuth (protegida)
router.get('/user', authJWT, oauthController.getUser);

module.exports = router;