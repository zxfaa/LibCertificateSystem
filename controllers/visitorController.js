// controllers/visitorController.js
const visitorService = require('../services/visitorService');

// 檢查訪客 ID
// 檢查訪客 ID
async function checkVisitor(req, res) {
    try {
        const visitorId = req.body.id;
        const visitor = await visitorService.getVisitorById(visitorId);

        if (!visitor) {
            // 找不到訪客時，返回 200 狀態碼，但 exists 為 false
            return res.status(200).json({ 
                exists: false,
                message: '找不到訪客資料'
            });
        }

        // 根據身份類型及 visitorId 獲取換證編號
        const certificateReplacementNumber = await visitorService.getCertificateReplacementNumberByVisitorId(visitor.identity_type, visitorId);

        // 找到訪客時，返回訪客資料以及換證編號
        return res.status(200).json({ 
            exists: true, 
            visitor,
            certificateReplacementNumber
        });
    } catch (error) {
        // 真正的錯誤情況
        return res.status(500).json({ 
            error: error.message,
            message: '查詢過程發生錯誤'
        });
    }
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

// 記錄進館
async function markEntry(req, res) {
    try {
        const { id, name, phone, id_type, identity_type, visitor_id } = req.body;

        // 更新 Visitor 資料
        await visitorService.updateVisitorEntry(id, name, phone, id_type, identity_type);

        // 根據身份類型將資料加入對應的資料表
        await visitorService.syncToIdentityTable(identity_type, id ,visitor_id );

        return res.status(200).json({ message: '進館成功' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function markExit(req, res) {
    try {
        const visitorId = req.body.id;
        await visitorService.markExit(visitorId);
        res.status(200).json({ message: '離館成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//獲得當前的換證編號
async function getCertificateReplacementNumber(req, res) {
    try {
        const identityType = req.body.identityType;
        const nextId = await visitorService.getNextAvailableId(identityType);
        res.status(200).json({ nextId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 更新訪客資料
async function updateVisitor(req, res) {
    try {
        const visitorId = req.body.id;
        const updatedData = {
            name: req.body.name,
            phone: req.body.phone,
            identity_type: req.body.identity,
            id_type: req.body.idType,
            exchange_number: req.body.exchangeNumber,
            is_entered: req.body.isEnter === 'true', // 轉換為布林值
            entry_time: req.body.entryTime ? new Date(req.body.entryTime) : null,
            exit_time: req.body.exitTime ? new Date(req.body.exitTime) : null,
            ban_status: req.body.ban === 'true', // 轉換為布林值
            remarks: req.body.remarks,
        };

        // 查找訪客資料
        const visitor = await visitorService.getVisitorById(visitorId);
        if (!visitor) {
            return res.status(404).json({ message: '找不到訪客資料' });
        }

        // 更新訪客資料
        await visitorService.updateVisitor(visitorId, updatedData);

        // 如果是進館狀態被改為否，則刪除對應身份資料
        if (updatedData.is_entered === false) {
            await visitorService.deleteVisitorById(visitor.identity_type, visitorId);
        }

        return res.status(200).json({ message: '訪客資料更新成功' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getCertificateReplacementNumber,
    checkVisitor,
    createVisitor,
    markEntry,
    markExit,
    updateVisitor
};
