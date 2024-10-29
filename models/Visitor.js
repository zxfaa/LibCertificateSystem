// models/Visitor.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visitor = sequelize.define('Visitors', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 標註這是主鍵
        type: DataTypes.STRING(20),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    id_type: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    identity_type: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    entry_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    exit_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_entered: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    ban: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    remarks: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    timestamps: false // 禁用 createdAt 和 updatedAt
});

module.exports = Visitor;
