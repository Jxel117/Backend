const { Model } = require('sequelize');

// --- IMPLEMENTACIÓN DETALLADA ---
// Este archivo define el modelo 'Token' que registra todos los tokens activos de los usuarios.
// Esto nos permite implementar un sistema robusto de logout donde el servidor valida
// si un token está en la lista negra (blacklist) y así invalida sesiones.
// Beneficios:
// 1. Logout inmediato: El servidor marca el token como inactivo.
// 2. Seguridad: Previene reutilización de tokens después del logout.
// 3. Auditoría: Registro de cuándo se emiten y revocan tokens.

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {}

  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'true = token activo, false = token revocado (logout)',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Fecha de expiración del token JWT',
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha en la que el token fue revocado por logout',
      },
    },
    {
      sequelize,
      modelName: 'Token',
      timestamps: true, // Añade createdAt y updatedAt automáticamente
      indexes: [
        {
          fields: ['userId'],
        },
        {
          fields: ['token'],
          unique: true,
        },
        {
          fields: ['isActive'],
        },
      ],
    }
  );

  return Token;
};
