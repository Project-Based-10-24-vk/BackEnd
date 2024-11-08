const multer = require('multer')
const { enums } = require('~/consts/validation')
const storage = multer.memoryStorage()
const upload = (filter = enums.FILES_EXTENTIONS_ENUM) =>
  multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
      fieldNameSize: 100
    },
    fileFilter: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1]
      if (filter.includes(extension)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    }
  })

const uploadImage = upload(enums.IMAGE_EXTENTIONS_ENUM)
const uploadDocument = upload(enums.DOCUMENT_EXTENTIONS_ENUM)
const uploadVideo = upload(enums.VIDEO_EXTENTIONS_ENUM)

module.exports = { upload, uploadImage, uploadDocument, uploadVideo }
