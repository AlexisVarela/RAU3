const Producto = require('../models/ProductoModel');
const Carrito = require('../models/CarritoModel');

const getHome = async (req, res) => {
  try {
    // 1. Traemos todos los productos para Home
    const productos = await Producto.find();

    // 2. Inicializamos carrito y total
    let carrito = { productos: [] };
    let total = 0;

    // 3. Si hay usuario logueado, traemos su carrito
    if (req.session?.usuario) {
      const carritoUsuario = await Carrito.findOne({ usuario: req.session.usuario.id })
        .populate('productos.producto');

      if (carritoUsuario) {
        carrito = carritoUsuario;

        // 4. Calculamos el total con reduce
        total = carrito.productos.reduce((acc, item) => {
          const precio = item.producto?.precio || 0;
          const cantidad = item.cantidad || 0;
          return acc + precio * cantidad;
        }, 0);
      }
    }

    // 5. Renderizamos todo junto
    res.render('home', {
      title: 'Home',
      productos,
      carrito,
      total
    });

  } catch (err) {
    console.error("Error en getHome:", err.message);
    res.status(500).send('Error al cargar la página principal');
  }
};


module.exports = {getHome};