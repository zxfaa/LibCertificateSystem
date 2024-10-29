const sequelize = require('./config/database');
const Visitor = require('./models/Visitor'); // 引入 Visitors 模型

async function updateVisitor(visitorId, newData) {
    try {
        console.log(`嘗試更新 ID ${visitorId} 的資料:`, newData); // 打印要更新的資料
        const [updated] = await Visitor.update(newData, {
            where: { id: visitorId } // 使用 id 作為查詢條件
        });

        if (updated) {
            console.log(`訪客 ID ${visitorId} 的資料已更新`);
        } else {
            console.log(`未找到訪客 ID ${visitorId}`);
        }
    } catch (error) {
        console.error('更新失敗:', error);
    }
}

async function getVisitor(visitorId) {
    try {
        const visitor = await Visitor.findByPk(visitorId); // 使用主鍵查詢
        if (visitor) {
            console.log('查詢結果:', visitor.toJSON());
        } else {
            console.log(`未找到訪客 ID ${visitorId}`);
        }
    } catch (error) {
        console.error('查詢失敗:', error);
    }
}

async function closeConnection() {
    try {
        await sequelize.close(); // 關閉 Sequelize 連接
        console.log('資料庫連接已關閉');
    } catch (error) {
        console.error('關閉連接時發生錯誤:', error);
    }
}

async function testUpdateVisitor(visitorId, newData) {
    await updateVisitor(visitorId, newData);
    await getVisitor(visitorId);
    await closeConnection(); // 在測試結束後關閉連接
}

// 測試更新
testUpdateVisitor("A123456789", {
    name: '大帥哥',
    phone: '0987654321',
    remarks: 'Updated visitor info'
});
