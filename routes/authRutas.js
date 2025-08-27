// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {hola, login, register, getCarritoYProductos} = require('../controller/authController');
const {addProducto, deleteProducto, comprarCarrito, borrarCarrito, updateCantidad } = require('../controller/controllerCarrito');
const {verificarSesion2} = require('../middlewares/verificarSesion');

router.get('/', hola)
router.post('/register', register);
router.post('/login', login);

// router.get('/carritoP',  verificarSesion2, getCarrito2, getProductos);
router.get('/carritoP',  verificarSesion2, getCarritoYProductos);
router.post('/carritoP/add',   verificarSesion2, addProducto);
router.post('/carritoP/delete/:productoId',   verificarSesion2, deleteProducto);
router.post('/carritoP/comprar',  verificarSesion2, comprarCarrito);
router.post('/carritoP/vaciar',  verificarSesion2, borrarCarrito);
router.post('/carritoP/update/:productoId',  verificarSesion2, updateCantidad);

module.exports = router;
