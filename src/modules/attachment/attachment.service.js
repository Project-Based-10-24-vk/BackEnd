const Attachment = require('./attachment.model')
const supabaseService = require('../../services/supabase')

const attachmentService = {
  create: async (author, fileData) => {
    const newAttachment = {
      name: fileData.name,
      size: fileData.size,
      author: author,
      url: fileData.url,
      extension: fileData.extension
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

  delete: async (attachmentId) => {
    const attachment = await attachmentService.findById(attachmentId)

    if (!attachment) {
      throw new Error('Attachment not found')
    }

    await supabaseService.removeFromStorage(attachment.url)

    return await Attachment.findByIdAndDelete(attachmentId)
  }
}

module.exports = attachmentService
