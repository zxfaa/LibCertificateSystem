// services/visitorService.js
const Visitor = require('../models/Visitor'); // 引入 Visitor 模型
const GeneralPublic = require('../models/GeneralPublic');
const HighSchool = require('../models/HighSchool');
const TcfshStudent = require('../models/tcfshStudent');
const Vip = require('../models/Vip');

// 根據 ID 查找訪客
async function getVisitorById(visitorId) {
    const visitor = await Visitor.findByPk(visitorId);
    return visitor; // 如果找到，返回訪客資料，否則返回 null
}

// 根據身份類型及 visitorId 獲取換證編號
async function getCertificateReplacementNumberByVisitorId(identityType, visitorId) {
    let model;
    
    switch (identityType) {
        case '一般':
            model = GeneralPublic;
            break;
        case '高中職':
            model = HighSchool;
            break;
        case '一中':
            model = TcfshStudent;
            break;
        case '敬老':
            model = Vip;
            break;
        default:
            throw new Error('未知的身份類型');
    }

    const record = await model.findOne({
        where: { visitor_id: visitorId },
        attributes: ['id']
    });

    return record ? record.id : null;
}

// 新增訪客資料
async function addVisitor(visitorData) {
    const newVisitor = await Visitor.create(visitorData);
    return newVisitor;
}
async function getNextAvailableId(identityType) {
    let model, maxLimit;
    
    switch (identityType) {
        case '一般':
            model = GeneralPublic;
            maxLimit = 25;
            break;
        case '高中職':
            model = HighSchool;
            maxLimit = 20;
            break;
        case '一中':
            model = TcfshStudent;
            maxLimit = 20;
            break;
        case '敬老':
            model = Vip;
            maxLimit = 5;
            break;
        default:
            throw new Error('未知的身份類別');
    }

    const count = await model.count();
    if (count >= maxLimit) throw new Error('已達到該類別的進館上限');

    // 獲取目前所有已存在的 ID
    const existingIds = await model.findAll({
        attributes: ['id'],
        raw: true,
    });

    const usedIds = existingIds.map(entry => entry.id);
    let nextAvailableId = 1; // 從 1 開始尋找

    // 尋找最小未使用的 ID
    while (nextAvailableId <= maxLimit) {
        if (!usedIds.includes(nextAvailableId)) {
            return nextAvailableId; // 找到未使用的 ID
        }
        nextAvailableId++;
    }

    throw new Error('所有可用的 ID 均已被佔用');
}

// 更新訪客進館資訊
async function updateVisitorEntry(id, name, phone, id_type, identity_type) {
    const visitor = await Visitor.findByPk(id);
    if (!visitor) {
        throw new Error('找不到訪客資料');
    }
    
    visitor.name = name;
    visitor.phone = phone;
    visitor.id_type = id_type;
    visitor.identity_type = identity_type;
    visitor.entry_time = new Date(); // 設定當前時間
    visitor.is_entered = true; // 設定為進館狀態
    await visitor.save();
}

// 根據身份類型將資料同步加入對應的資料表
async function syncToIdentityTable(identity_type,id,visitor_id) {
    let model;

    switch (identity_type) {
        case '一般':
            model = GeneralPublic;
            break;
        case '高中職':
            model = HighSchool;
            break;
        case '一中':
            model = TcfshStudent;
            break;
        case '敬老':
            model = Vip;
            break;
        default:
            throw new Error('未知的身份類型');
    }

    // 根據 visitor_id 將資料加入對應表
    await model.create({  id: visitor_id, // 使用換證編號作為 ID
                        visitor_id: id // 將 visitor_id 設置為頁面上輸入的 ID
    });
}
// services/visitorService.js
async function markExit(visitorId) {
    // 查找 visitor 資料
    const visitor = await Visitor.findByPk(visitorId);
    if (!visitor) {
        throw new Error('找不到訪客資料');
    }

    // 更新 visitor 的 is_entered 狀態和 exit_time
    visitor.is_entered = false;
    visitor.exit_time = new Date();
    await visitor.save();

    // 根據 identity_type 刪除對應表中的資料
    let model;
    switch (visitor.identity_type) {
        case '一般':
            model = GeneralPublic;
            break;
        case '高中職':
            model = HighSchool;
            break;
        case '一中':
            model = TcfshStudent;
            break;
        case '敬老':
            model = Vip;
            break;
        default:
            throw new Error('未知的身份類型');
    }

    // 刪除對應身份類型資料表中的紀錄
    await model.destroy({
        where: { visitor_id: visitorId }
    });
}

// 更新訪客資料
async function updateVisitor(visitorId, updatedData) {
    const visitor = await Visitor.findByPk(visitorId);
    if (!visitor) {
        throw new Error('找不到訪客資料');
    }

    // 更新訪客的屬性
    Object.assign(visitor, updatedData);
    await visitor.save();
}

// 根據身份類型刪除對應身份表中的資料
async function deleteVisitorById(identity_type, visitorId) {
    let model;

    switch (identity_type) {
        case '一般':
            model = GeneralPublic;
            break;
        case '高中職':
            model = HighSchool;
            break;
        case '一中':
            model = TcfshStudent;
            break;
        case '敬老':
            model = Vip;
            break;
        default:
            throw new Error('未知的身份類型');
    }

    // 刪除對應身份類型資料表中的紀錄
    await model.destroy({
        where: { visitor_id: visitorId }
    });
}


module.exports = {
    getVisitorById,
    addVisitor,
    getNextAvailableId,
    updateVisitorEntry,
    syncToIdentityTable,
    getCertificateReplacementNumberByVisitorId,
    markExit,
    updateVisitor,
    deleteVisitorById
};
