const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar token JWT (misma función que en authController)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto_por_defecto', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Callback de Google OAuth
exports.googleCallback = async (req, res, next) => {
  try {
    // Generar token JWT
    const token = generateToken(req.user._id);
    
    // Redireccionar al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-success?token=${token}`);
  } catch (error) {
    next(error);
  }
};

// Obtener información del usuario después de OAuth
exports.getUser = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    next(error);
  }
};