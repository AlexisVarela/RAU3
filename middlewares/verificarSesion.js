const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function verificarSesion(req, res, next) {
  // 1️⃣ Intentar leer de la cookie
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

// function for validate if there user or not
function haySesion(req, res, next){
    if (req.session.usuario) {
        return next();
    } else {
        res.redirect('/user/login');
    }
}

module.exports = {verificarSesion, haySesion};

