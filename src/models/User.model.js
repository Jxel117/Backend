const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true, 
      validate: { isEmail: true } 
    },
    password: { type: DataTypes.STRING, allowNull: false },
    
    // --- NUEVOS CAMPOS ---
    isVerified: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    verificationCode: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    // ✅ CORRECCIÓN: 'avatar' ahora está DENTRO del objeto de configuración
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null 
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // (Opcional) Hook para encriptar si el usuario cambia la contraseña después
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
  });

  return User;
};
