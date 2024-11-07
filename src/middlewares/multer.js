const multer = require('multer')
const { enums } = require('~/consts/validation')
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldNameSize: 100
  },
  fileFilter: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1]
    if (enums.FILES_EXTENTIONS_ENUM.includes(extension)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'))
    }
  }
})

module.exports = upload
