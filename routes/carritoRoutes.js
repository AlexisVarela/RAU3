const express = require('express');
const router = express.Router();
const { getCarrito, addProducto, deleteProducto, comprarCarrito, borrarCarrito, updateCantidad } = require('../controller/controllerCarrito');
const {verificarSesion, haySesion} = require('../middlewares/verificarSesion');

router.get('/',  haySesion, getCarrito);
router.post('/add',  haySesion, addProducto);
router.post('/delete/:productoId',  haySesion, deleteProducto);
router.post('/comprar', haySesion, comprarCarrito);
router.post('/vaciar', haySesion, borrarCarrito);
router.post('/update/:productoId', haySesion, updateCantidad);

module.exports = router;
