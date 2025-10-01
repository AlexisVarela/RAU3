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

# Dar permisos de ejecución a binarios de node_modules
RUN chmod +x node_modules/.bin/jest

# Comando por defecto: correr Jest y guardar resultados en JSON
CMD ["npx", "jest", "--detectOpenHandles", "--json", "--outputFile=./test-results/results.json"]


