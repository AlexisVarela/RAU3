const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const passport = require('passport'); // Passport
require('./config/passport2'); // Estrategias Passport

// Variables de entorno
const dotenv = require('dotenv');
dotenv.config(); 
const PORT = process.env.PORT || 3000;
const secret_Session = process.env.secret_Session;

// Middleware: Permitir PUT y DELETE
app.use(methodOverride('_method'));

// Middleware: procesar formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout'); 

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Mongo
const { conectarMongo } = require('./config/conectarMongo');
conectarMongo();

// Sesión: **Primero la sesión**
const sesion = require('express-session');
app.use(sesion({
  secret: secret_Session,
  resave: false,
  saveUninitialized: false
}));

// Passport: **Después de la sesión**
app.use(passport.initialize());
app.use(passport.session());

// Variable global para vistas
app.use((req, res, next) => {
  res.locals.Usuario = req.session.usuario || null;
  next();
});

// Rutas
const rutasPrincipal = require('./routes/rutasPrincipal');
app.get('/', rutasPrincipal);

const rutasProductos = require('./routes/rutasProductos');
app.use('/', rutasProductos);

const authRutas = require('./routes/authRutas');
app.use('/api/auth', authRutas);

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const carritoRoutes = require('./routes/carritoRoutes');
app.use('/carrito', carritoRoutes);

const oauth2 = require('./routes/oauth2');
app.use('/auth', oauth2);

// Puerto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
