
// --- IMPLEMENTACIÓN DETALLADA ---
// Este archivo centraliza la configuración de la conexión a la base de datos PostgreSQL.
// Utiliza variables de entorno para mantener las credenciales seguras y fuera del código fuente.
// Sequelize utilizará esta configuración para interactuar con la base de datos.

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // Opciones adicionales
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Muestra logs de SQL en desarrollo
    dialectOptions: {
      // Opciones específicas para producción, como la configuración de SSL
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    }
  }
);

module.exports = sequelize;
