const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Importamos el controlador nuevo

// CORRECCIÓN: Apuntamos a la carpeta 'middlewares' (plural) y al archivo 'auth.middleware'
const auth = require('../middlewares/auth.middleware'); 

// --- RUTAS ---

// Obtener perfil del usuario (GET /api/users/profile)
// Usamos 'userController.getUserProfile' que acabamos de crear
router.get('/profile', auth, userController.getUserProfile);

// Si tenías una ruta raíz también (GET /api/users/)
router.get('/', auth, userController.getUserProfile);

// Actualizar usuario
router.put('/', auth, userController.updateUser);

module.exports = router;