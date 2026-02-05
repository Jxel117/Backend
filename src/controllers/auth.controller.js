// ============================================
// 5. ACTUALIZAR USUARIO (MODIFICADO) 🔥
// ============================================
exports.updateUser = async (req, res) => {
  const { username, avatar } = req.body; // <--- Agregamos 'avatar'

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Actualizamos campos si vienen en la petición
    if (username) user.username = username;
    if (avatar) user.avatar = avatar; // <--- Guardamos el nombre del icono
    
    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar, // <--- Devolvemos el avatar
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};
