
const { Model } = require('sequelize');

// --- IMPLEMENTACIÓN DETALLADA ---
// Define el modelo 'Transaction' para la tabla de transacciones.
// Representa un gasto o un ingreso registrado por un usuario.
// Incluye campos clave como tipo, categoría y monto.

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {}

  Transaction.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('expense', 'income'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true, // Detalles opcionales que se pueden añadir después
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Transaction',
    timestamps: true,
  });

  return Transaction;
};
