const Attachment = require('./attachment.model')
const { supabase, supabaseUrl } = require('./supabase.client')
const { v4: uuidv4 } = require('uuid')

const attachmentService = {
  uploadToStorage: async (attachment) => {
    const uniqueId = uuidv4()
    const extension = attachment.originalname.split('.').pop()
    const baseName = attachment.originalname.replace(/\.[^/.]+$/, '')

    const sanitizedFileName = `${baseName.replace(/\s+/g, '_').replace(/[^\w\-.]/g, '')}_${uniqueId}.${extension}`

    const { error } = await supabase.storage.from('attachments').upload(sanitizedFileName, attachment.buffer, {
      contentType: attachment.mimetype
    })

    if (error) {
      throw new Error(error.message)
    }

    const url = `${supabaseUrl}/storage/v1/object/public/attachments/${sanitizedFileName}`

    return { url, extension }
  },

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

    const filePath = attachment.url.split('/attachments/')[1]
    const { error } = await supabase.storage.from('attachments').remove([filePath])

    if (error) {
      throw new Error(`Failed to delete file from storage: ${error.message}`)
    }

    return await Attachment.findByIdAndDelete(attachmentId)
  }
}

module.exports = attachmentService
