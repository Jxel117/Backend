const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// 1. IMPORTANTE: Importamos 'auth' directamente (ya no usamos llaves { })
// Asegúrate de que el nombre del archivo sea correcto (auth.middleware.js o auth.js)
const auth = require('../middlewares/auth.middleware'); 

const { check } = require('express-validator');

// --- RUTAS ---

// Obtener todas las transacciones (Protegida)
router.get('/', auth, transactionController.getAllTransactions);

// Crear una transacción (Protegida + Validaciones)
router.post(
    '/',
    [
        auth, // <--- Aquí usamos el middleware
        check('amount', 'El monto es obligatorio').not().isEmpty(),
        check('type', 'El tipo es obligatorio').isIn(['income', 'expense']),
        check('category', 'La categoría es obligatoria').not().isEmpty()
    ],
    transactionController.createTransaction
);

// Borrar transacción
router.delete('/:id', auth, transactionController.deleteTransaction);

module.exports = router;