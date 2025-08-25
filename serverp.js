const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
require('./config/passport');

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const oauthRoutes = require('./routes/oauth');
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.static('public'));

app.use(cors({
  origin: 'http://localhost:3000', // O el puerto de tu frontend
  credentials: true
}));

app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos
// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://heythatsme:kali@basesita.rc5np.mongodb.net/carritoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/carrito', cartRoutes);
app.use('/auth', oauthRoutes);
app.use('/api/products', productRoutes);


// Manejo de errores
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});