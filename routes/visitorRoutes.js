// routes/visitorRoutes.js
const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// 檢查訪客 ID
router.post('/check-visitor', visitorController.checkVisitor);

// 新增訪客
router.post('/', visitorController.createVisitor);

//獲得當前換證編號
router.post('/certificate-replacement-number', visitorController.getCertificateReplacementNumber);
//更新資料
router.put('/update', visitorController.updateVisitor);
// 記錄進館
router.post('/mark-entry', visitorController.markEntry);
//紀錄離館
router.post('/mark-exit', visitorController.markExit);


module.exports = router;
