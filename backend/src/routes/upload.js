const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const fileBuffer = req.file.buffer;
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = `items/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('lost-found-images')
      .upload(filePath, fileBuffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('lost-found-images')
      .getPublicUrl(filePath);

    res.json({
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        filename: fileName,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image'
    });
  }
});

// Delete image
router.delete('/image', async (req, res) => {
  try {
    const { path: filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      });
    }

    const { data, error } = await supabase.storage
      .from('lost-found-images')
      .remove([filePath]);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete image'
    });
  }
});

module.exports = router;

