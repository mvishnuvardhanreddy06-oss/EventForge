const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Whitelist of allowed MIME types
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed',
  'video/mp4'
]);

// Dangerous extensions strictly blocked regardless of declared MIME type
const BLOCKED_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'php', 'phtml', 'php3', 'php4', 'php5',
  'js', 'mjs', 'cjs', 'html', 'htm', 'xhtml', 'svg', 'xml', 'jsp',
  'asp', 'aspx', 'cgi', 'pl', 'py', 'rb', 'jar', 'vbs', 'com', 'scr'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate UUID-based filename to completely eliminate path traversal and null-byte injection
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/gi, '');
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  // 1. Block dangerous extensions
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return cb(new Error(`File upload rejected: .${ext} files are not permitted for security reasons.`));
  }

  // 2. Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    return cb(new Error(`Invalid file MIME type (${file.mimetype}). Allowed types: PDF, PPT, Word, ZIP, MP4, and standard images.`));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB maximum file size
    files: 5
  },
  fileFilter
});

module.exports = upload;
