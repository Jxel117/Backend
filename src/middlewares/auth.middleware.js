const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Leer el token del header (Exactamente como lo envía tu App)
  const token = req.header('x-auth-token');

  // 2. Si no hay token, denegar acceso
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, permiso denegado' });
  }

  // 3. Verificar la firma del token (Solo criptografía, sin base de datos)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardamos el usuario descifrado en la petición para que el controlador lo use
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido o expirado' });
  }
};