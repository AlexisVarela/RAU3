const { getHome } = require('../controller/ControllerHome');
const Producto = require('../models/ProductoModel');
const Carrito = require('../models/CarritoModel');

jest.mock('../models/ProductoModel');
jest.mock('../models/CarritoModel');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  return res;
};

describe("HomeController", () => {
  afterEach(() => jest.clearAllMocks());

  it("debería renderizar home con productos y carrito vacío si no hay usuario", async () => {
    const req = {};
    const res = mockResponse();

    Producto.find.mockResolvedValue([{ nombre: "Prod1", precio: 10 }]);

    await getHome(req, res);

    expect(res.render).toHaveBeenCalledWith("home", expect.objectContaining({
      productos: [{ nombre: "Prod1", precio: 10 }],
      carrito: { productos: [] },
      total: 0
    }));
  });

it("debería renderizar home con carrito del usuario si existe", async () => {
  const req = { session: { usuario: { id: "123" } } };
  const res = mockResponse();

  Producto.find.mockResolvedValue([
    { nombre: "Prod1", precio: 10 },
    { nombre: "Prod2", precio: 10 }
  ]);

  Carrito.findOne.mockReturnValue({
    populate: jest.fn().mockResolvedValue({
      productos: [
        { producto: { nombre: "Prod1", precio: 10 }, cantidad: 1 },
        { producto: { nombre: "Prod2", precio: 10 }, cantidad: 1 }
      ]
    })
  });

  await getHome(req, res);

  expect(res.render).toHaveBeenCalledWith("home", expect.objectContaining({
    productos: expect.any(Array),
    carrito: expect.any(Object),
    total: 20
  }));
});

});
