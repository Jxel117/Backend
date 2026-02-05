const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/auth.middleware'); 

const { 
    register, 
    login, 
    verifyEmail, 
    getProfile,
    updateUser // <--- 🔥 IMPORTANTE: IMPORTAR ESTO
} = require('../controllers/auth.controller');

const router = express.Router();

// Ruta de Registro Manual
router.post('/register', [
    check('username', 'El usuario es requerido').not().isEmpty(),
    check('email', 'Incluye un email válido').isEmail(),
    check('password', 'Mínimo 6 caracteres').isLength({ min: 6 }),
  ], register);

// Ruta de Login Manual
router.post('/login', login);

// Ruta de Verificación de Código Manual
router.post('/verify', verifyEmail);

// Ruta para obtener perfil (protegida)
router.get('/', auth, getProfile);

// 🔥 RUTA NUEVA: ACTUALIZAR PERFIL (protegida)
router.put('/update', auth, updateUser);

module.exports = router;
