// controllers/userController.js
const Usuario = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 
const JWT_SECRET = process.env.JWT_SECRET;

// Mostrar formulario login
const getLogin = (req, res) => {
  res.render('login'); // tu vista login.ejs
};

// Mostrar formulario registro
const getRegister = (req, res) => {
  res.render('register'); // tu vista register.ejs
};

// Procesar login
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.render('login', { error: 'Credenciales incorrectas' });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.render('login', { error: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: usuario._id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

    // Guardar token en cookie (opcional) o enviarlo al front
    res.cookie('token', token, { httpOnly: true });
    // se guarda al usuario en la sesion
      req.session.usuario = {
        id: usuario._id,
        username: usuario.nombre
      };

      console.log('Se ha iniciado sesión con el token: ' + token);

    res.redirect('/'); // redirigir a inicio o carrito
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error en el servidor' });
  }
};

// Procesar registro
const postRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.render('register', { error: 'Usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ nombre: username, email, password: hashedPassword });
    await nuevoUsuario.save();

    res.redirect('/user/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error en el servidor' });
  }
};

//
module.exports={getLogin, getRegister, postLogin, postRegister};