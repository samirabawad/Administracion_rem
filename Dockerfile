# Imagen base con Node 22
FROM node:22

# Crear carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar Angular CLI 18 globalmente
RUN npm install -g @angular/cli@18.2.14

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto usado por ng serve (internamente)
EXPOSE 4200

# Ejecutar Angular en modo desarrollo accesible desde fuera
CMD ["ng", "serve", "--host", "0.0.0.0"]

