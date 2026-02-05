
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const basename = path.basename(__filename);
const db = {};

// --- IMPLEMENTACIÓN DETALLADA ---
// Este archivo es el corazón de nuestra capa de datos con Sequelize.
// 1. Lee dinámicamente todos los archivos de modelos (ej. User.model.js) en el directorio actual.
// 2. Importa y los inicializa, asociándolos a la instancia de Sequelize.
// 3. Establece las relaciones entre los modelos (ej. Un Usuario tiene muchas Transacciones).
// 4. Exporta un objeto `db` que contiene la instancia de Sequelize y todos los modelos,
//    listo para ser usado en el resto de la aplicación.

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-9) === '.model.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Definición de las asociaciones (relaciones) entre modelos
const { User, Transaction, Budget, Token } = db;

// Un usuario puede tener muchas transacciones
User.hasMany(Transaction, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', // Si se elimina un usuario, se eliminan sus transacciones
});
Transaction.belongsTo(User, {
  foreignKey: 'userId',
});

// Un usuario puede tener muchos presupuestos
User.hasMany(Budget, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Budget.belongsTo(User, {
  foreignKey: 'userId',
});

// Un usuario puede tener muchos tokens
User.hasMany(Token, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', // Si se elimina un usuario, se eliminan todos sus tokens
});
Token.belongsTo(User, {
  foreignKey: 'userId',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
