// routes/rutasProductos.js
const express = require('express');
const router = express.Router();
const { getProductos } = require('../controller/ControllerProductos');

// Endpoint para ver productos
router.get('/productos', getProductos);

module.exports = router;
