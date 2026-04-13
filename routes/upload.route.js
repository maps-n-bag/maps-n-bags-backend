const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth.middleware');
const controller = require('../controllers/upload.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

router.post('/', auth, upload.array('files', 10), controller.uploadFiles);

module.exports = router;
