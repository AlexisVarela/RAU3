# Imagen oficial de Node
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del proyecto
COPY . .

# Puerto de la aplicación (ajústalo según tu app)
EXPOSE 3000

# Comando por defecto: arrancar la app
CMD ["npm", "start"]
