const File = require('../models/File');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const secretKey = '@##@';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const generateUniqueCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.uploadFile = upload.single('file');

exports.saveFile = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.authorization, secretKey);
    const { filename, path } = req.file;
    const code = generateUniqueCode();

    const file = await File.create({ userId, filename, code, path });

    res.json({ message: 'File uploaded successfully', file });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFileList = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.authorization, secretKey);
    const files = await File.find({ userId });

    res.json({ files });
  } catch (error) {
    console.error('Error fetching file list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.authorization, secretKey);
    const { fileId } = req.params;

    const file = await File.findOne({ code: fileId, userId });
    if (!file) {
      return res.status(404).json({ message: 'File not found or does not belong to the user' });
    }

    await File.deleteFileByCode(fileId);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.downloadFile = async (req, res) => {
    try {
      const { userId } = jwt.verify(req.headers.authorization, secretKey);
      const { fileId } = req.params;
  
      const file = await File.findOne({ code: fileId, userId });
  
      if (!file) {
        return res.status(404).json({ message: 'File not found or does not belong to the user' });
      }
  
      const filePath = path.join(__dirname, '..', file.path);
  
      res.sendFile(filePath, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file.filename}`,
        },
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
