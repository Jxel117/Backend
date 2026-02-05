const { Transaction } = require('../models');
const { validationResult } = require('express-validator');

// 1. Obtener todas las transacciones del usuario logueado
exports.getAllTransactions = async (req, res) => {
  try {
    // Buscamos transacciones donde userId coincida con el usuario del token
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']] // Las más recientes primero
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// 2. Crear una nueva transacción
exports.createTransaction = async (req, res) => {
  // Revisar si hay errores de validación (express-validator)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, type, category, categoryIcon, date } = req.body;

  try {
    const newTransaction = await Transaction.create({
      amount,
      type,
      category,
      categoryIcon, // Icono opcional
      date: date || new Date(),
      userId: req.user.id // Importante: Asociar al usuario del token
    });

    res.json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// 3. Borrar una transacción
exports.deleteTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transacción no encontrada' });
    }

    // Verificar que la transacción pertenezca al usuario logueado
    if (transaction.userId !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    await transaction.destroy();
    res.json({ msg: 'Transacción eliminada' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};