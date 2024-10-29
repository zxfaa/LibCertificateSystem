// models/tcfshStudent.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Visitors = require('./Visitor'); // 引入 Visitors 模型

const tcfshStudent = sequelize.define('tcfshStudents', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 標註這是主鍵
    },
    visitor_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Visitors,
            key: 'id'
        },
        onDelete: 'CASCADE' // 若訪客資料被刪除，則此資料也會被刪除
    }
}, {
    timestamps: false // 禁用 createdAt 和 updatedAt
});

// 設定關聯
tcfshStudent.belongsTo(Visitors, { foreignKey: 'visitor_id' });

module.exports = tcfshStudent;
