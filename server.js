const express = require('express');
const path = require('path'); // 引入 path 模組
const sequelize = require('./config/database'); // 載入資料庫連接設定
const Visitor = require('./models/Visitor'); // 載入 Visitor 模型
const app = express();
const PORT = 3000;

// 解析 JSON 請求體
app.use(express.json());

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, 'client'))); 

// 設置首頁路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html')); // 確保路徑正確
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在運行於 http://localhost:${PORT}`);
});
// 測試連接資料庫
sequelize.authenticate()
    .then(() => console.log('資料庫連接正常'))
    .catch(err => console.error('無法連接資料庫:', err));
// API: 新增訪客資料
app.post('/visitors', async (req, res) => {
    try {
        const newVisitor = await Visitor.create(req.body);
        res.status(201).json(newVisitor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: 查詢所有訪客資料
app.get('/visitors', async (req, res) => {
    try {
        const visitors = await Visitor.findAll();
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: 用 ID 查詢指定訪客資料
app.get('/visitors/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findByPk(req.params.id);
        if (visitor) {
            res.status(200).json(visitor);
        } else {
            res.status(404).json({ message: '未找到訪客' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: 用 ID 更新指定訪客資料
app.put('/visitors/:id', async (req, res) => {
    try {
        const [updated] = await Visitor.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedVisitor = await Visitor.findByPk(req.params.id);
            res.status(200).json(updatedVisitor);
        } else {
            res.status(404).json({ message: '未找到訪客' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: 用 ID 刪除指定訪客資料
app.delete('/visitors/:id', async (req, res) => {
    try {
        const deleted = await Visitor.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send(); // 無內容回應
        } else {
            res.status(404).json({ message: '未找到訪客' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
