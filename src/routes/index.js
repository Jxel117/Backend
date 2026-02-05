
const express = require('express');
const authRoutes = require('./auth.routes.js');
const transactionRoutes = require('./transaction.routes.js'); // Asegurando que este nombre sea exacto
const userRoutes = require('./user.routes.js');

// --- IMPLEMENTACIÓN DETALLADA ---
// Este archivo actúa como el enrutador principal de la API.
// Su única responsabilidad es importar y registrar todos los demás enrutadores de la aplicación
// bajo sus respectivos prefijos de ruta. Esto mantiene el código de enrutamiento organizado y modular.

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);
// Futuras rutas como '/budgets' se añadirían aquí.

module.exports = router;
