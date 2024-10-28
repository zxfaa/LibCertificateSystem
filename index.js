const express = require('express');
const mysql = require('mysql2'); // 引入 mysql2 庫
const app = express();
const PORT = 3000;

// 建立資料庫連線
const db = mysql.createConnection({
    host: 'localhost',    // 資料庫伺服器位址
    user: 'root',         // MySQL 使用者名稱
    password: '000000', // MySQL 密碼
    database: 'Client' // 資料庫名稱
});

// 連接到資料庫
db.connect((err) => {
    if (err) {
        console.error('資料庫連線失敗: ' + err.stack);
        return;
    }
    console.log('已成功連接到資料庫');
});

// 簡單的首頁路由
app.get('/', (req, res) => {
    res.send('Welcome to the Visitor Management System!');
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在運行於 http://localhost:${PORT}`);
});

// 獲取所有訪客資料
app.get('/visitors', (req, res) => {
    const sql = 'SELECT * FROM Visitors';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// 創建新訪客記錄
app.post('/visitors', (req, res) => {
    const { name, visit_date, status } = req.body; // 根據你的資料表結構修改欄位
    const sql = 'INSERT INTO Visitors (name, visit_date, status) VALUES (?, ?, ?)';
    db.query(sql, [name, visit_date, status], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId });
    });
});

// 更新訪客狀態
app.put('/visitors/:id', (req, res) => {
    const id = req.params.id;
    const { status } = req.body; // 假設你只想更新狀態
    const sql = 'UPDATE Visitors SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: '狀態更新成功' });
    });
});

// 刪除訪客記錄
app.delete('/visitors/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM Visitors WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: '訪客記錄已刪除' });
    });
});
