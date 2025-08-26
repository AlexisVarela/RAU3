// Variables para conectar a mongo
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// cargar variables de entorno
dotenv.config();

// Función para conectar con mongo
const conectarMongo = async () => {
    try {
        // crea una variable que espera a que se establesca coneccion con la variable de entorno
        const coneccion = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('🌱 Mongo conectado en la coleccion:', coneccion.connection.name);
    } catch (err) {
        console.error('Hubo un error con mongo: ', err);
        process.exit(1);
    }
}
// Exportar el metodo que conecta con mongo
module.exports = {conectarMongo};