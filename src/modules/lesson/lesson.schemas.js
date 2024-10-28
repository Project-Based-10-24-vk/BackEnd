const {
  enums: { RESOURCES_TYPES_ENUM }
} = require('~/consts/validation')

const lessonValidation = {
  CREATE: {
    title: {
      type: 'string',
      required: true,
      length: {
        min: 1,
        max: 100
      }
    },
    description: {
      type: 'string',
      required: true,
      length: {
        min: 1,
        max: 1000
      }
    },
    content: {
      type: 'string',
      required: true,
      length: {
        min: 50
      }
    },
    category: {
      type: 'string',
      required: false
    },
    resourceType: {
      type: 'string',
      required: false,
      enum: RESOURCES_TYPES_ENUM
    }
  },
  UPDATE: {
    title: {
      type: 'string',
      required: false,
      length: {
        min: 1,
        max: 100
      }
    },
    description: {
      type: 'string',
      required: false,
      length: {
        min: 1,
        max: 1000
      }
    },
    content: {
      type: 'string',
      required: false,
      length: {
        min: 50
      }
    },
    category: {
      type: 'string',
      required: false
    },
    resourceType: {
      type: 'string',
      required: false,
      enum: RESOURCES_TYPES_ENUM
    }
  }
}

module.exports = { lessonValidation }
