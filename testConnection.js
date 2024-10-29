// testConnection.js
const sequelize = require('./config/database');
const Visitor = require('./models/Visitor'); // 引入 Visitors 模型

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('資料庫連接正常');

        // 創建一條訪客記錄
        const newVisitor = await Visitor.create({
            id: 'A123456789',
            name: 'John Doe',
            phone: '0912345678',
            id_type: 'Passport',
            identity_type: 'General',
            entry_time: new Date(),
            exit_time: null,
            is_entered: true,
            ban: false,
            remarks: 'First time visitor'
        });
        console.log('新訪客已創建:', newVisitor.toJSON());

        // 查詢所有訪客
        const visitor = await Visitor.findAll();
        console.log('所有訪客:', visitor.map(visitor => visitor.toJSON()));

    } catch (error) {
        console.error('無法連接到資料庫:', error);
    } finally {
        await sequelize.close();
    }
}

testConnection();
