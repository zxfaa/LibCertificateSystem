// services/visitorService.js
const Visitor = require('../models/Visitor'); // 引入 Visitor 模型

// 根據 ID 查找訪客
async function getVisitorById(visitorId) {
    const visitor = await Visitor.findByPk(visitorId);
    return visitor; // 如果找到，返回訪客資料，否則返回 null
}

// 新增訪客資料
async function addVisitor(visitorData) {
    const newVisitor = await Visitor.create(visitorData);
    return newVisitor;
}

module.exports = {
    getVisitorById,
    addVisitor,
};
