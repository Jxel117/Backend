const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/auth.middleware'); // <--- AHORA ES UNA FUNCIÓN DIRECTA

const { 
    register, 
    login, 
    verifyEmail, 
    googleLogin,
    getProfile // <--- AGREGAR ESTO
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

// Ruta de Login con Google
router.post('/google', googleLogin);

// --- AGREGAR ESTA RUTA PARA EL PERFIL ---
// Esta usa 'auth' para verificar el token y devolver los datos del usuario
router.get('/', auth, getProfile);

module.exports = router;  