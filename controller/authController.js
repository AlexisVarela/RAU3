// controllers/authController.js
const Usuario = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Carrito = require('../models/CarritoModel');
const Producto = require('../models/ProductoModel');

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

const getCarritoYProductos = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ msg: 'No autorizado' });
    }
    // Traer carrito
    const carrito = await Carrito.findOne({ usuario: req.usuario.id })
      .populate('productos.producto');
    // Traer productos
    const productos = await Producto.find();
    // Calcular total
    let total = 0;
    if (carrito?.productos?.length > 0) {
      total = carrito.productos.reduce((acc, item) => {
        const precio = item.producto?.precio || 0;
        const cantidad = item.cantidad || 0;
        return acc + precio * cantidad;
      }, 0);
    }
    // Renderizar todo junto
    // res.render('home', { 
    //   title: 'Home', 
    //   productos,
    //   carrito,
    //   Usuario: req.usuario,
    //   total
    // });
     res.json({ carrito });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos');
  }
};




module.exports = {hola, login, register, getCarritoYProductos};