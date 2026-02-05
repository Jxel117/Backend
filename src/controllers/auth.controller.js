const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendWelcomeEmail } = require('../services/email.service'); 

// --- 1. REGISTRO (HÍBRIDO: MANUAL O GOOGLE) ---
// EN: controllers/auth.controller.js

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;

  // Validación Gmail
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(400).json({ msg: 'Solo se permiten cuentas @gmail.com' });
  }

  try {
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ msg: 'El usuario ya existe' });

    // --- CAMBIO IMPORTANTE: ---
    // Creamos el usuario YA verificado para que pueda entrar directo.
    // (Más adelante podrás activar la lógica del código si quieres)
    user = await User.create({ 
      username, 
      email, 
      password,
      isVerified: true, // <--- ESTO SOLUCIONA EL BLOQUEO DE LOGIN
      verificationCode: null 
    });

    // --- GENERAR TOKEN INMEDIATAMENTE ---
    // Esto es lo que le faltaba a tu AuthContext para funcionar
    const payload = { user: { id: user.id } };
    
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      // Devolvemos el token y el usuario
      res.status(201).json({ token, user });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// --- 2. LOGIN CON GOOGLE (SOLO VERIFICACIÓN) ---
exports.googleLogin = async (req, res) => {
  const { email, name } = req.body;

  // Validación Gmail
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(400).json({ msg: 'Acceso restringido a cuentas @gmail.com' });
  }

  try {
    // Buscamos si el usuario ya existe en la BD
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // CASO A: NO EXISTE -> Avisamos al Frontend para que lo mande a la pantalla de Registro
      return res.status(200).json({ 
        isNewUser: true, 
        email: email, // Devolvemos el email para que se autollene en el formulario
        name: name 
      });
    }

    // CASO B: YA EXISTE -> Generamos Token y entra directo
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user, isNewUser: false });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// --- 3. VERIFICAR CÓDIGO (SOLO FLUJO MANUAL) ---
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: 'Código incorrecto' });
    }

    // Activar usuario y limpiar código
    user.isVerified = true;
    user.verificationCode = null; 
    await user.save();

    res.json({ msg: 'Cuenta verificada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
};

// --- 4. LOGIN MANUAL (REQUIERE ESTAR VERIFICADO) ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    // VERIFICAR SI LA CUENTA ESTÁ ACTIVADA
    if (!user.isVerified) {
      return res.status(403).json({ msg: 'Tu cuenta no ha sido verificada. Revisa tu correo.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// --- 5. OBTENER PERFIL ---
exports.getProfile = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
      res.json(user);
    } catch (err) {
      res.status(500).send('Server error');
    }
};
