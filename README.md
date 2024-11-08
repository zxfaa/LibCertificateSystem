# 中科大圖書館換證管理系統

## 專案概述
本系統是專為中科大圖書館開發的訪客管理系統，用於管理進出圖書館的訪客資料，包括訪客的基本資訊、進出時間記錄、換證管理等功能。系統採用 Node.js 開發，搭配 MySQL 資料庫，提供簡單直觀的使用者介面。

## 功能特點
- 訪客資料管理
  - 快速查詢訪客資訊
  - 新增訪客記錄
  - 更新訪客資料
  - 自動驗證身份證字號格式
- 進出管理
  - 自動記錄進館時間
  - 自動記錄離館時間
  - 換證編號自動分配
- 證件管理
  - 支援多種證件類型（身分證、護照等）
  - 自動化換證編號分配系統
- 停權管理
  - 停權狀態設定
  - 備註記錄功能

## 系統需求
- Node.js 14.0 或以上版本
- MySQL 5.7 或以上版本
- 現代瀏覽器（支援 ES6+）

## 安裝步驟

### 1. 下載專案

### 2. 安裝相依套件
```bash
npm install
```

### 3. 資料庫設定
1. 在 MySQL 中創建新的資料庫：
```sql
CREATE DATABASE client;
```

2. 導入資料庫結構和資料：
```bash
# 方法 1：使用 MySQL 命令列
mysql -u root -p client < Database/[資料庫備份檔案名稱].sql

# 方法 2：使用 MySQL Workbench
# 1. 開啟 MySQL Workbench
# 2. 連接到您的資料庫
# 3. 選擇 Server > Data Import
# 4. 選擇 "Import from Self-Contained File"
# 5. 選擇專案中的 Database/[資料庫備份檔案名稱].sql
# 6. 選擇 "client" 資料庫
# 7. 點擊 "Start Import"
```

3. 確認資料庫配置：
檢查 `config/database.js` 中的設定是否正確：
```javascript
const sequelize = new Sequelize('client', 'root', '您的密碼', {
    host: 'localhost',
    dialect: 'mysql'
});
```

### 4. 啟動系統
```bash
node server.js
```
成功啟動後，您會看到以下訊息：
- 伺服器正在運行於 http://localhost:3000
- 資料庫連接正常

## API 文檔

### 訪客查詢與管理
1. 查詢訪客
```
POST /api/visitors/check-visitor
請求參數: 
{
    "id": "A123456789" // 訪客身份證字號
}
回應格式:
{
    "exists": true/false,
    "visitor": {
        "id": "A123456789",
        "name": "姓名",
        "phone": "電話",
        "id_type": "證件類型",
        "identity_type": "身分類型",
        "is_entered": true/false,
        "entry_time": "進入時間",
        "exit_time": "離開時間"
    },
    "certificateReplacementNumber": "換證編號"
}
```

2. 新增訪客
```
POST /api/visitors
請求參數:
{
    "id": "A123456789",
    "name": "訪客姓名",
    "phone": "電話號碼"
}
回應格式:
{
    "success": true/false,
    "message": "訪客已成功新增"
}
```

3. 更新訪客資料
```
PUT /api/visitors/update
請求參數:
{
    "id": "訪客ID",
    "name": "姓名",
    "phone": "電話",
    "identity": "身分類型",
    "idType": "證件類型",
    "exchangeNumber": "換證編號",
    "isEnter": true/false,
    "entryTime": "進入時間",
    "exitTime": "離開時間",
    "ban": true/false,
    "remarks": "備註"
}
回應格式:
{
    "success": true/false,
    "message": "更新結果訊息"
}
```

### 進出管理
1. 登記進館
```
POST /api/visitors/mark-entry
請求參數:
{
    "id": "訪客ID",
    "name": "姓名",
    "phone": "電話",
    "id_type": "證件類型",
    "identity_type": "身分類型",
    "visitor_id": "換證編號"
}
回應格式:
{
    "success": true/false,
    "message": "進館登記結果"
}
```

2. 登記離館
```
POST /api/visitors/mark-exit
請求參數:
{
    "id": "訪客ID"
}
回應格式:
{
    "success": true/false,
    "message": "離館登記結果"
}
```

### 換證編號管理
1. 獲取換證編號
```
POST /api/visitors/certificate-replacement-number
請求參數:
{
    "identityType": "身分類型"
}
回應格式:
{
    "nextId": "下一個可用的換證編號"
}
```

### 錯誤處理
所有 API 在發生錯誤時會返回以下格式:
```json
{
    "success": false,
    "error": "錯誤描述信息"
}
```

### API 使用注意事項
1. 所有請求需要包含 Content-Type: application/json 標頭
2. ID 格式驗證：一位大寫字母加九位數字
3. 時間格式採用 ISO 8601 標準
4. 換證編號為自動產生，不可手動指定
5. 所有 API 回應均包含操作狀態（success）和相應訊息（message）

### 狀態碼說明
- 200：請求成功
- 400：請求參數錯誤
- 404：資源不存在
- 500：伺服器內部錯誤
