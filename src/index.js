require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = 'dev'; 

const db = require('./models');
const mainRouter = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// 1. Inicialización de la App Express
const app = express();
const PORT = process.env.PORT || 3001;

// 2. Middlewares Esenciales
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('morgan')(morgan));

// 3. Documentación de la API (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servir archivos estáticos (por si acaso usas uploads locales)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 4. Rutas Principales
app.use('/api', mainRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', message: 'Server is healthy' });
});

// 5. Conexión y Sincronización
// ⚠️ CAMBIO IMPORTANTE AQUÍ 👇
// Usamos { alter: true } para que agregue la columna 'avatar' SI NO EXISTE,
// pero MANTENIENDO tus usuarios actuales.
db.sequelize.sync({ alter: false }) 
  .then(() => {
    console.log('✅ Base de datos sincronizada.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error DB:', err);
  });
