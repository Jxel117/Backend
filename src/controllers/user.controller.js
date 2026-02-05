const { User } = require('../models');

// 1. Obtener datos del usuario logueado
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id viene del middleware (el token)
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verificationCode'] } // No devolvemos la contraseña
    });

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// 2. Actualizar usuario (Opcional, por si lo necesitas a futuro)
exports.updateUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    if (username) user.username = username;
    
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};