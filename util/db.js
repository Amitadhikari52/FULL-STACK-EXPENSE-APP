const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_tracker', 'root', 'root123', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
