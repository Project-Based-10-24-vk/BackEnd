const { Schema, model } = require('mongoose')
const { regex } = require('~/consts/validation')
const { ATTACHMENT } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')

const attachmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')],
      unique: true,
      trim: true
    },
    size: {
      type: Number,
      required: [true, FIELD_CANNOT_BE_EMPTY('size')],
      min: [0, 'Size must be a positive number']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, FIELD_CANNOT_BE_EMPTY('author')]
    },

    url: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('url')],
      validate: {
        validator: function (url) {
          return regex.URL_PATTERN.test(url)
        },
        message: 'Invalid URL format'
      }
    },
    extension: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('extension')],
      trim: true
    }
  },
  { timestamps: true, versionKey: false }
)

module.exports = model(ATTACHMENT, attachmentSchema)
