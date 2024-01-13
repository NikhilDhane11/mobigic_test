const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.uploadFile, fileController.saveFile);
router.get('/files', fileController.getFileList);
router.delete('/files/:fileId', fileController.deleteFile); // Added delete route
router.get('/files/download/:fileId', fileController.downloadFile);

module.exports = router;