const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldNameSize: 100
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|mp4|avi|mkv|webm|doc|docx|xls|xlsx/
    const extension = file.mimetype.split('/')[1]
    if (allowedTypes.test(extension)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'))
    }
  }
})

module.exports = upload
