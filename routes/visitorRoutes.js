// routes/visitorRoutes.js
const express = require('express');
const visitorController = require('../controllers/visitorController');
const router = express.Router();

// 檢查訪客 ID
router.post('/check-visitor', visitorController.checkVisitor);

// 新增訪客
router.post('/', visitorController.createVisitor);

module.exports = router;
