const Attachment = require('./attachment.model')

const attachmentService = {
  create: async (author, data) => {
    if (Array.isArray(data)) {
      const array = await Promise.all(
        data.map(async (attachment) => ({
          name: attachment.name,
          size: attachment.size,
          author: author,
          url: attachment.url
        }))
      )
      return await Attachment.create(array)
    }
    const newAttachment = {
      name: data.name,
      size: data.size,
      author: author,
      url: data.url
    }
    return await Attachment.create(newAttachment)
  },

  findMany: async (match) => {
    const items = await Attachment.find(match).lean().exec()
    const count = await Attachment.countDocuments(match)
    return { count, items }
  },

  findById: async (id) => {
    return await Attachment.findById(id).lean().exec()
  },

  update: async (id, data) => {
    return await Attachment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      lean: true
    }).exec()
  },

  delete: async (id) => {
    return await Attachment.findByIdAndDelete(id).exec()
  }
}

module.exports = attachmentService
