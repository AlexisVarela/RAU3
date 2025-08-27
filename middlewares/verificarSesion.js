const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function verificarSesion(req, res, next) {
  // Intentar leer de la cookie
  const token = req.cookies?.token;
  if (!token) {
    return res.redirect('/user/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // usuario disponible para controllers
    next();
  } catch (err) {
    return res.redirect('/user/login');
  }
}

// verificar sesion 2
function verificarSesion2(req, res, next) {
  // Intentar obtener token del header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ msg: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // usuario disponible para controllers
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
}

// function for validate if there user or not
function haySesion(req, res, next){
    if (req.session.usuario) {
        return next();
    } else {
        res.redirect('/user/login');
    }
}

module.exports = {verificarSesion, verificarSesion2, haySesion};

