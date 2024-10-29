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

// 記錄進館
router.post('/mark-entry', visitorController.markEntry);

module.exports = router;
