const { Schema, model } = require('mongoose')

const { SUBJECT_CATEGORY } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY, FIELD_CANNOT_BE_LONGER, FIELD_CANNOT_BE_SHORTER } = require('~/consts/errors')

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')],
      minLength: [1, FIELD_CANNOT_BE_SHORTER('name', 1)],
      maxLength: [50, FIELD_CANNOT_BE_LONGER('name', 50)],
      unique: true,
      lowercase: true
    },
    category: {
      type: Schema.Types.ObjectId,
      default: null
    }
  },
  { timestamps: true, versionKey: false }
)

module.exports = model(SUBJECT_CATEGORY, subjectSchema)
