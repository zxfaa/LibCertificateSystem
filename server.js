const express = require('express');
const path = require('path'); // 引入 path 模組
const sequelize = require('./config/database'); // 載入資料庫連接設定
const visitorRoutes = require('./routes/visitorRoutes'); // 確保引入 visitorRoutes
const app = express();
const PORT = 3000;

// 解析 JSON 請求體
app.use(express.json());

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, 'client'))); 

// 使用訪客路由
app.use('/api/visitors', visitorRoutes); // 使用 visitorRoutes

// 設置首頁路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html')); // 確保路徑正確
});
app.get("/server",(req,res) =>{
    res.sendFile(path.join(__dirname, 'client', 'server.html')); // 確保路徑正確

});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在運行於 http://localhost:${PORT}`);
});

// 測試連接資料庫
sequelize.authenticate()
    .then(() => console.log('資料庫連接正常'))
    .catch(err => console.error('無法連接資料庫:', err));


