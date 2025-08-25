const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

// Cargar las variables de entorno
const dotenv = require('dotenv');
dotenv.config(); 

// variables de entorno
const PORT = process.env.PORT || 3000;
const secret_Session = process.env.secret_Session;


// Permisos para realizar peticiones put y delete
app.use(methodOverride('_method'));

// renderizado de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Procesar datos de los formularios 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout'); 

// Mongo
const {conectarMongo} = require('./controller/config/conectarMongo');
conectarMongo();

// implementación del session
const sesion = require('express-session');
app.use(express.urlencoded({extended:true}));
app.use(sesion({
    secret: secret_Session,
    resave: false,
    saveUninitialized:false
}));

// es una ruta que actua como middleware que asigna un valor global
// a la variable usuario de la sesion 
app.use((req, res, next) => {
  res.locals.Usuario = req.session.usuario || null; // variable global
  next();
});

// rutas
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




// Configuración del puerto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});