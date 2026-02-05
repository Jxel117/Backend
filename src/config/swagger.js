
const swaggerJsdoc = require('swagger-jsdoc');

// --- IMPLEMENTACIÓN DETALLADA ---
// Este archivo configura swagger-jsdoc, la herramienta que genera la especificación OpenAPI (Swagger)
// a partir de comentarios JSDoc escritos directamente en nuestros archivos de rutas.
// Esto mantiene la documentación y el código juntos, facilitando su mantenimiento.

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GastanGO API',
      version: '1.0.0',
      description: 'API documentation for the GastanGO Personal Finance Management System.',
      contact: {
        name: 'GastanGO Support',
        url: 'https://example.com',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development Server',
      },
    ],
    // Se define un esquema de seguridad para JWT, que se podrá referenciar en las rutas protegidas.
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // La propiedad 'apis' le dice a swagger-jsdoc dónde encontrar los comentarios de documentación.
  // Apuntamos a todos los archivos de rutas.
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
