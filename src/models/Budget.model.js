
const { Model } = require('sequelize');

// --- IMPLEMENTACIÓN DETALLADA ---
// Define el modelo 'Budget' para la tabla de presupuestos.
// Permite a los usuarios establecer límites de gasto por categoría para un período específico.
// Este es un modelo base para funcionalidades futuras.

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {}

  Budget.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    limit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01,
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
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
    modelName: 'Budget',
    timestamps: true,
  });

  return Budget;
};
