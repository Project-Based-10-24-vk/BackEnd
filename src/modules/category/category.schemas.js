const { regex } = require('~/consts/validation')

const categoryValidation = {
  CREATE: {
    name: {
      type: 'string',
      required: true
    },
    icon: {
      type: 'string',
      required: false
    },
    color: {
      type: 'string',
      required: false,
      regex: regex.COLOR_PATTERN
    }
  }
}

module.exports = { categoryValidation }
