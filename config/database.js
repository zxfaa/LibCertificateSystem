// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('client', 'root', '000000', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log('已成功連接到資料庫'))
    .catch(err => console.error('無法連接資料庫:', err));

module.exports = sequelize;
