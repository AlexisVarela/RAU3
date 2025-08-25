// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};
