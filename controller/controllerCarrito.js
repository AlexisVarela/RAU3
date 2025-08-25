const Carrito = require('../models/CarritoModel');
const Producto = require('../models/ProductoModel');

// Obtener carrito del usuario
const getCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.session.usuario.id })
      .populate('productos.producto');


    let total = 0;
    if (carrito.productos?.length > 0) {
      total = carrito.productos.reduce((acc, item) => {
        const precio = item.producto?.precio || 0;
        const cantidad = item.cantidad || 0;
        return acc + precio * cantidad;
      }, 0);
    }

    res.render('home', { 
      title: 'Home', 
      productos: [], // opcional, puedes pasar productos si quieres
      carrito,
      Usuario: req.session.usuario,
      total 
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el carrito');
  }
};

// Agregar producto al carrito
const addProducto = async (req, res) => {
  const { productoId, cantidad } = req.body;

  try {
    let carrito = await Carrito.findOne({ usuario: req.session.usuario.id });

    if (!carrito) {
      carrito = new Carrito({ usuario: req.session.usuario.id, productos: [] });
    }

    const index = carrito.productos.findIndex(p => p.producto.toString() === productoId);

    if (index > -1) {
      carrito.productos[index].cantidad += parseInt(cantidad);
    } else {
      carrito.productos.push({ producto: productoId, cantidad });
    }

    await carrito.save();
    res.redirect('/'); // redirige a home para actualizar la vista
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al agregar producto');
  }
};

const updateCantidad = async (req, res) => {
  try {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    if (!req.session?.usuario) {
      return res.status(401).send("Debes iniciar sesión para actualizar el carrito");
    }

    const carrito = await Carrito.findOne({ usuario: req.session.usuario.id });
    if (!carrito) return res.status(404).send("Carrito no encontrado");

    const index = carrito.productos.findIndex(p => p.producto.toString() === productoId);
    if (index === -1) return res.status(404).send("Producto no encontrado en el carrito");

    carrito.productos[index].cantidad = parseInt(cantidad);
    await carrito.save();

    res.redirect('/'); // redirige al home para actualizar vista
  } catch (err) {
    console.error("Error al actualizar cantidad:", err.message);
    res.status(500).send("Error al actualizar cantidad del producto");
  }
};


// Eliminar producto del carrito
const deleteProducto = async (req, res) => {
  const { productoId } = req.params;

  try {
    const carrito = await Carrito.findOne({ usuario: req.session.usuario.id });
    if (!carrito) return res.status(404).send('Carrito no encontrado');

    carrito.productos = carrito.productos.filter(p => p.producto.toString() !== productoId);

    await carrito.save();
    res.redirect('/'); // redirige a home
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar producto');
  }
};

const comprarCarrito = async (req, res) => {
  try {
    if (!req.session?.usuario) {
      return res.status(401).send("Debes iniciar sesión para comprar");
    }

    const carrito = await Carrito.findOne({ usuario: req.session.usuario.id })
      .populate('productos.producto');

    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).send("El carrito está vacío");
    }

    // Calculamos el total y actualizamos stock
    let total = 0;
    for (const item of carrito.productos) {
      const producto = item.producto;
      const cantidad = item.cantidad;

      // Sumar al total
      total += producto.precio * cantidad;

      // Verificar stock suficiente
      if (producto.stock < cantidad) {
        return res.status(400).send(`No hay suficiente stock para ${producto.nombre}`);
      }

      // Reducir stock
      producto.stock -= cantidad;
      await producto.save();
    }

    // Vaciar carrito después de la compra
    carrito.productos = [];
    await carrito.save();

    console.log("Total de la compra:", total);

    // Redirigir al home
    res.redirect('/');

  } catch (err) {
    console.error("Error en comprarCarrito:", err.message);
    res.status(500).send("Error al procesar la compra");
  }
};

const borrarCarrito = async (req, res) => {
   try {
    if (!req.session?.usuario) {
      return res.status(401).send("Debes iniciar sesión para comprar");
    }

    const carrito = await Carrito.findOne({ usuario: req.session.usuario.id })
      .populate('productos.producto');

    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).send("El carrito está vacío");
    }

    // para vaciar 
    carrito.productos = [];
    await carrito.save();

    res.redirect('/');
    console.log("Se ha vaciado el carrito correctamente")

  } catch (err) {
    console.error("Error al vaciar", err.message);
    res.status(500).send("Error al vaciar");
  }
}


module.exports = { getCarrito, addProducto, deleteProducto, updateCantidad , comprarCarrito, borrarCarrito };
