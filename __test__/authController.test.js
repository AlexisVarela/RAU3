const { register, login } = require('../controller/authController');
const Usuario = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mockear dependencias
jest.mock('../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Crear objetos req y res simulados
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debería registrar un usuario nuevo', async () => {
      const req = {
        body: { nombre: 'Alexis', email: 'alexis@test.com', password: '123456' }
      };
      const res = mockResponse();

      Usuario.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      Usuario.prototype.save = jest.fn().mockResolvedValue({});

      await register(req, res);

      expect(Usuario.findOne).toHaveBeenCalledWith({ email: 'alexis@test.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Usuario registrado correctamente' });
    });

    it('debería devolver error si el usuario ya existe', async () => {
      const req = {
        body: { nombre: 'Juan', email: 'juan@test.com', password: '123456' }
      };
      const res = mockResponse();

      Usuario.findOne.mockResolvedValue({ email: 'juan@test.com' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Usuario ya existe' });
    });
  });

  describe('login', () => {
    it('debería devolver token si las credenciales son correctas', async () => {
      const req = {
        body: { email: 'juan@test.com', password: '123456' }
      };
      const res = mockResponse();

      Usuario.findOne.mockResolvedValue({
        email: 'juan@test.com',
        password: 'hashedPassword',
        _id: '123'
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fakeToken');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
    });

    it('debería devolver error si el usuario no existe', async () => {
      const req = { body: { email: 'no@test.com', password: '123' } };
      const res = mockResponse();

      Usuario.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Credenciales incorrectas' });
    });
  });
});
