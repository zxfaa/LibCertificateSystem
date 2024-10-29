const sequelize = require('./config/database'); // 確保你引入了 sequelize
const Visitor = require('./models/Visitor'); // 引入 Visitors 模型

async function deleteVisitor(visitorId) {
    try {
        const result = await Visitor.destroy({
            where: {
                id: visitorId // 指定要刪除的訪客 ID
            }
        });

        if (result === 0) {
            console.log(`訪客 ID ${visitorId} 不存在或已被刪除。`);
        } else {
            console.log(`訪客 ID ${visitorId} 已成功刪除。`);
        }
    } catch (error) {
        console.error('刪除訪客時發生錯誤:', error);
    }finally{
        await sequelize.close();
    }
}

// 測試刪除訪客
deleteVisitor("A123456789"); // 替換為你想刪除的訪客 ID
