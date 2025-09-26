const {
  getCarrito,
  comprarCarrito,
  borrarCarrito,
} = require("../controller/controllerCarrito");

const Carrito = require("../models/CarritoModel");
const Producto = require("../models/ProductoModel");

jest.mock("../models/CarritoModel");
jest.mock("../models/ProductoModel");

describe("CarritoController", () => {
  let req, res;
  let mockProducto, mockCarrito;

  beforeEach(() => {
    mockProducto = {
      _id: "prod1",
      nombre: "Prod1",
      precio: 10,
      stock: 3,
      save: jest.fn().mockResolvedValue(true),
    };

    mockCarrito = {
      usuario: "123",
      productos: [],
      save: jest.fn().mockResolvedValue(true),
    };

    req = { session: { usuario: { id: "123" } } };
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("getCarrito debería renderizar home con carrito vacío", async () => {
    Carrito.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCarrito),
    });

    await getCarrito(req, res);

    expect(Carrito.findOne).toHaveBeenCalledWith({ usuario: "123" });
    expect(res.render).toHaveBeenCalledWith(
      "home",
      expect.objectContaining({
        carrito: mockCarrito,
        total: 0,
        Usuario: req.session.usuario,
      })
    );
  });

  test("comprarCarrito debería vaciar carrito y actualizar stock", async () => {
    // Carrito con producto
    mockCarrito.productos.push({ producto: mockProducto, cantidad: 2 });

    Carrito.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCarrito),
    });
    Producto.findById.mockResolvedValue(mockProducto);

    await comprarCarrito(req, res);

    // Stock actualizado
    expect(mockProducto.stock).toBe(1); // 3 - 2
    // Carrito vacío
    expect(mockCarrito.productos.length).toBe(0);
    // Redirige al home
    expect(res.redirect).toHaveBeenCalledWith("/");
  });

  test("borrarCarrito debería vaciar el carrito manualmente", async () => {
    // Carrito con producto
    mockCarrito.productos.push({ producto: mockProducto, cantidad: 1 });

    Carrito.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCarrito),
    });

    await borrarCarrito(req, res);

    expect(mockCarrito.productos.length).toBe(0);
    expect(res.redirect).toHaveBeenCalledWith("/");
  });
});
