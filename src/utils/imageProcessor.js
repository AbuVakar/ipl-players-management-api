const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ImageProcessor {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.ensureUploadDir();
  }

  // Ensure upload directory exists
  async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  // Process and save image
  async processImage(file) {
    try {
      // Generate unique filename
      const filename = `${uuidv4()}.jpg`;
      const filepath = path.join(this.uploadDir, filename);

      // Process image with Sharp
      await sharp(file.data)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(filepath);

      // Return the image URL
      return `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${filename}`;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  }

  // Delete image file
  async deleteImage(imageUrl) {
    try {
      if (!imageUrl) return;

      const filename = path.basename(imageUrl);
      const filepath = path.join(this.uploadDir, filename);

      await fs.unlink(filepath);
    } catch (error) {
      console.error('Image deletion error:', error);
      // Don't throw error for image deletion failures
    }
  }

  // Validate image file
  validateImage(file) {
    if (!file) {
      throw new Error('Image file is required');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.data.length > maxSize) {
      throw new Error('Image file size too large. Maximum size is 5MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid image type. Allowed types: JPEG, PNG, WebP');
    }

    return true;
  }

  // Get image file path for serving static files
  getImagePath(filename) {
    return path.join(this.uploadDir, filename);
  }
}

module.exports = new ImageProcessor(); 