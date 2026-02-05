const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// ============================================
// 1. REGISTRO - Autenticación 100% propia
// ============================================
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Datos inválidos',
      errors: errors.array() 
    });
  }

  const { username, email, password } = req.body;

  // Validación de dominio @gmail.com (sin usar Google)
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(400).json({ 
      success: false,
      message: 'Solo se permiten correos @gmail.com' 
    });
  }

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'Este correo ya está registrado' 
      });
    }

    // Verificar si el username ya existe
    let existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ 
        success: false,
        message: 'Este nombre de usuario ya existe' 
      });
    }

    // Crear usuario verificado (sin verificación por correo)
    user = await User.create({ 
      username, 
      email, 
      password, // Se hashea automáticamente en el hook del modelo
      isVerified: true, // Acceso inmediato
      verificationCode: null 
    });

    // Generar token JWT
    const payload = { user: { id: user.id } };
    
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }, 
      (err, token) => {
        if (err) throw err;
        
        // Devolver datos del usuario sin contraseña
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified
        };

        res.status(201).json({ 
          success: true,
          message: 'Registro exitoso',
          token, 
          user: userData 
        });
      }
    );

  } catch (err) {
    console.error('Error en registro:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// ============================================
// 2. LOGIN - Autenticación propia
// ============================================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validaciones básicas
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Ingresa tu correo y contraseña' 
    });
  }

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Credenciales incorrectas' 
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Credenciales incorrectas' 
      });
    }

    // Verificar si la cuenta está activada (por si activas verificación después)
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Tu cuenta no ha sido verificada' 
      });
    }

    // Generar token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }, 
      (err, token) => {
        if (err) throw err;
        
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified
        };

        res.json({ 
          success: true,
          message: 'Inicio de sesión exitoso',
          token,
          user: userData
        });
      }
    );
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// ============================================
// 3. OBTENER PERFIL (Ruta protegida)
// ============================================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { 
      attributes: { exclude: ['password', 'verificationCode'] } 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Error obteniendo perfil:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor' 
    });
  }
};

// ============================================
// 4. VERIFICAR CÓDIGO (Opcional - para futuro)
// ============================================
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ 
        success: false,
        message: 'Código incorrecto' 
      });
    }

    user.isVerified = true;
    user.verificationCode = null; 
    await user.save();

    res.json({ 
      success: true,
      message: 'Cuenta verificada exitosamente' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor' 
    });
  }
};
