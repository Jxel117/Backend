const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/auth.middleware');

// Importamos el objeto completo para evitar errores de undefined
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Registro
router.post('/register', [
    check('username', 'Usuario requerido').not().isEmpty(),
    check('email', 'Email válido requerido').isEmail(),
    check('password', 'Mínimo 6 caracteres').isLength({ min: 6 })
], authController.register);

// Login
router.post('/login', authController.login);

// Verificar
router.post('/verify', authController.verifyEmail);

// Perfil
router.get('/', auth, authController.getProfile);

// Actualizar
router.put('/update', auth, authController.updateUser);

module.exports = router;
