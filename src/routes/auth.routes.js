const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/auth.middleware');

// Importamos TODO desde el controlador
const { 
    register, 
    login, 
    verifyEmail, 
    getProfile, 
    updateUser 
} = require('../controllers/auth.controller');

const router = express.Router();

// Registro
router.post('/register', [
    check('username', 'Usuario requerido').not().isEmpty(),
    check('email', 'Email válido requerido').isEmail(),
    check('password', 'Mínimo 6 caracteres').isLength({ min: 6 })
], register);

// Login
router.post('/login', login);

// Verificar (si se usa)
router.post('/verify', verifyEmail);

// Perfil (Protegida)
router.get('/', auth, getProfile);

// Actualizar Perfil (Protegida) - Nombre y Avatar
router.put('/update', auth, updateUser);

module.exports = router;
