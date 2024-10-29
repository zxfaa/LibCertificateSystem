// controllers/visitorController.js
const visitorService = require('../services/visitorService');

// 檢查訪客 ID
async function checkVisitor(req, res) {
    const visitorId = req.body.id; // 假設 ID 是從請求體中獲取的
    const visitor = await visitorService.getVisitorById(visitorId);

    if (!visitor) {
        return res.status(404).json({ exists: false });
    }
    return res.status(200).json({ exists: true, visitor });
}

// 新增訪客
async function createVisitor(req, res) {
    try {
        const visitorData = {
            id: req.body.id,
            name: req.body.name,
            phone: req.body.phone,
        };

        const newVisitor = await visitorService.addVisitor(visitorData);
        return res.status(201).json(newVisitor);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    checkVisitor,
    createVisitor,
};
