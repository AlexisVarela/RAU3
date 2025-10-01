# Imagen oficial de Node
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Crear carpeta para resultados de pruebas
RUN mkdir -p test-results

# Comando por defecto: correr Jest y guardar resultados en JSON
CMD ["npm", "test", "--", "--json", "--outputFile=./test-results/results.json"]
