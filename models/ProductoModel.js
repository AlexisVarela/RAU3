// models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: String
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
