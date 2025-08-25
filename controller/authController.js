// controllers/authController.js
const Usuario = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

// cargar variables de entorno
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; 

const hola = async (req, res) => {
  res.send('HOla');
}

// Registro
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ msg: 'Usuario ya existe' });

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword
    });

    await nuevoUsuario.save();

    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ msg: 'Credenciales incorrectas' });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(401).json({ msg: 'Credenciales incorrectas' });

    // Crear JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

module.exports = {hola, login, register} 