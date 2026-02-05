const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/auth.middleware');

// Importamos el OBJETO COMPLETO del controlador
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

// Verificar (placeholder)
router.post('/verify', authController.verifyEmail);

// Perfil
router.get('/', auth, authController.getProfile);

// Actualizar Perfil (Nombre y Avatar)
router.put('/update', auth, authController.updateUser);

module.exports = router;
