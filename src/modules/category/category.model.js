const { Schema, model } = require('mongoose')

const { CATEGORY } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')
const { regex } = require('~/consts/validation')

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')],
      unique: true,
      trim: true
    },
    appearance: {
      icon: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('icon')],
        default: 'mocked-path-to-icon'
      },
      color: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('color')],
        default: '#66C42C',
        lowercase: true,
        validate: {
          validator: function (color) {
            return regex.COLOR_PATTERN.test(color)
          },
          message: 'Color must be in hex format'
        }
      }
    }
  },
  { timestamps: true, versionKey: false }
)

module.exports = model(CATEGORY, categorySchema)
