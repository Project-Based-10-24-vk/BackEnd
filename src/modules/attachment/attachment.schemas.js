const { regex } = require('~/consts/validation')

const attachmentValidation = {
  CREATE: {
    name: { type: 'string', required: true },
    size: { type: 'number', required: true },
    url: { type: 'string', required: true, regex: regex.URL_PATTERN },
    extension: { type: 'string', required: true }
  },
  UPDATE: {
    name: { type: 'string', required: false },
    size: { type: 'number', required: false },
    url: { type: 'string', required: false, regex: regex.URL_PATTERN },
    extension: { type: 'string', required: false }
  }
}

module.exports = { attachmentValidation }
