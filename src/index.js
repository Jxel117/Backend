
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = 'dev'; // Using 'dev' for development logging

const db = require('./models');
const mainRouter = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// --- IMPLEMENTACIÓN DETALLADA ---
// Este es el archivo principal que arranca toda nuestra aplicación backend.
// Su responsabilidad es configurar el servidor Express, conectar los 'middlewares',
// definir las rutas, sincronizar la base de datos y poner el servidor a escuchar peticiones.

// 1. Inicialización de la App Express
const app = express();
const PORT = process.env.PORT || 3001;

// 2. Middlewares Esenciales
// Middlewares son funciones que se ejecutan en el ciclo de vida de una petición (request/response).
// Son cruciales para la seguridad, el logging y el parsing de datos.
app.use(cors()); // Habilita Cross-Origin Resource Sharing para permitir peticiones desde otros dominios (el frontend).
app.use(helmet()); // Añade varias cabeceras HTTP de seguridad para proteger la app de vulnerabilidades conocidas.
app.use(express.json()); // Parsea los cuerpos de las peticiones entrantes con formato JSON.
app.use(express.urlencoded({ extended: true })); // Parsea los cuerpos de las peticiones con formato URL-encoded.
app.use(require('morgan')(morgan));

// 3. Documentación de la API (Swagger)
// Servimos la documentación interactiva en la ruta /api-docs.
// Esto es increíblemente útil para que los desarrolladores de frontend (y nosotros mismos)
// entiendan y prueben la API sin necesidad de herramientas externas.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servir archivos estáticos (avatares/imágenes)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 4. Rutas Principales de la API
// Aquí conectamos nuestro enrutador principal. Todas las rutas definidas en la carpeta /routes
// estarán prefijadas con '/api'. Por ejemplo, una ruta '/auth/login' se volverá '/api/auth/login'.
app.use('/api', mainRouter);

// Ruta de health check para verificar que el servidor está vivo.
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', message: 'Server is healthy' });
});

// 5. Conexión y Sincronización con la Base de Datos
// Usamos Sequelize para gestionar la conexión y los modelos de datos.
// `db.sequelize.sync()` se asegura de que las tablas en la base de datos coincidan con los modelos definidos.
// `{ force: false }` previene que se borren las tablas en cada reinicio. Cambiar a `true` si necesitas un reinicio limpio.
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected and models synchronized.');
    // 6. Iniciar el Servidor
    // Solo después de que la base de datos esté lista, iniciamos el servidor para que escuche peticiones.
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
