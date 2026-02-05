const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// ============================================
// 1. REGISTRO
// ============================================
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { username, email, password } = req.body;

  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(400).json({ success: false, message: 'Solo correos @gmail.com' });
  }

  try {
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ success: false, message: 'El correo ya existe' });

    user = await User.create({ 
      username, 
      email, 
      password, 
      isVerified: true,
      avatar: null // Iniciamos avatar en null
    });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token, user: { id: user.id, username, email, avatar: user.avatar } });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
};

// ============================================
// 2. LOGIN
// ============================================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ success: false, message: 'Credenciales inválidas' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Credenciales inválidas' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        success: true, 
        token, 
        user: { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            avatar: user.avatar // Enviamos el avatar al front
        } 
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
};

// ============================================
// 3. OBTENER PERFIL
// ============================================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json({ success: true, ...user.toJSON() });
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
};

// ============================================
// 4. ACTUALIZAR USUARIO (NOMBRE Y AVATAR)
// ============================================
exports.updateUser = async (req, res) => {
  const { username, avatar } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    if (username) user.username = username;
    if (avatar) user.avatar = avatar; // Guardamos el nombre del icono

    await user.save();

    res.json({ 
        success: true, 
        message: 'Actualizado', 
        user: { 
            id: user.id, 
            username: user.username, 
            email: user.email, 
            avatar: user.avatar 
        } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando');
  }
};

// ============================================
// 5. VERIFICAR (Placeholder para que no rompa)
// ============================================
exports.verifyEmail = async (req, res) => {
    res.json({ success: true, message: 'Verificado' });
};
