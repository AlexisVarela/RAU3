# Resultado de Aplendizaje U3 y U4 Descripción

En este proyecto se desarrollo una página web de compras con carrito de
compras. La página se construyo con Node.js y Express, se implementó la
conexión a base de datos en la nube con MongoDBCloud y se utilizaron
herramientas de autenticación como Google OAuth 2.0 y la generación de 
token JWT.
El proyecto esta preparado con docker-compose, al contenedor se agregó
el proyecto y la base de datos en general.

# Pasos realizados para el despliegue
1 - Creación del proyecto
    - Inicialización del servidor
    - Creación de arquitectura para manejar archivos routes y controladores
        a la par de las vistas

2 - Se realiza conexión con la base de datos
    - Se implementa un controlador que establesca conexión con la BD

3 - Creación de modelos, rutas y controladores en el servidor
    - Se definen modelos basados en la estructura de la BD
    - Se definen métodos dentro de los controladores
    - Se crean los archivos routes que accederan a los métodos de los
        controladores
    - Se definen las rutas en el servidor

4 - Se realizan pruebas con insonmia
    - Se realizan pruebas para identificar posibles errores y verificar 
        el correcto funcionamiento de los endpoints como la generación
        de tokens
 
5 - Se crea Dockerfile
    - Se implementa la instalación de dependencias, imagen base, puerto y 
        comando de inicio.
 
6 - Configuración de docker-compose
    - Se implementa la configuración de servicios como el index.js y Mongo
        en conjunto de las demás variables de entorno.
        Se sube la aplicación a un contenedor

# Configuración de OAuth y JWT en contenedor
Este tipo de configuración siempre se coloca en el archivo 'docker-compose.yml'
debido a que ahí se cargan las variables de entorno que hacen funcionar el 
proyecto en general. Solo se cargan las variables de entorno correctamente en
el contenedor.