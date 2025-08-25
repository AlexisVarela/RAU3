// controller/ControllerProductos.js
const Producto = require('../models/ProductoModel');

// Listar todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.render('home', { title: 'Home', productos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los productos');
  }
};

module.exports = { getProductos };
