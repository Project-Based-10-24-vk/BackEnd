const getMatchOptions = require('~/utils/getMatchOptions')
const getRegex = require('~/utils/getRegex')
const {
  roles: { ADMIN }
} = require('~/consts/auth')
const attachmentService = require('./attachment.service')

const create = async (req, res) => {
  const attachments = req.files

  if (!attachments || attachments.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' })
  }

  try {
    const uploadedFiles = await Promise.all(
      attachments.map(async (attachment) => {
        const { url, extension } = await attachmentService.uploadToStorage(attachment)
        return {
          name: attachment.originalname,
          size: attachment.size,
          url,
          extension
        }
      })
    )

    const newAttachments = await Promise.all(
      uploadedFiles.map(async (file) => {
        return await attachmentService.create(req.user.id, file)
      })
    )

    return res.status(201).json(newAttachments)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const findMany = async (req, res) => {
  const { name = '', authorId } = req.query
  const matchOptions = { name: getRegex(name) }

  if (authorId) {
    matchOptions.author = authorId
  }

  const response = await attachmentService.findMany(getMatchOptions(matchOptions))
  res.status(200).json(response)
}

const findById = async (req, res) => {
  const { id } = req.params
  const response = await attachmentService.findById(id)

  if (!response) {
    return res.status(404).json({ message: 'Attachment not found' })
  }

  res.status(200).json(response)
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body

  const attachment = await attachmentService.findById(id)

  if (!attachment) {
    return res.status(404).json({ message: 'Attachment not found' })
  }

  if (req.user.id !== attachment.author.toString() && req.user.role !== ADMIN) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const updatedAttachment = await attachmentService.update(id, data)
  res.status(200).json(updatedAttachment)
}

const deleteAttachment = async (req, res) => {
  const { id } = req.params

  try {
    const attachment = await attachmentService.findById(id)

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' })
    }

    if (req.user.id !== attachment.author.toString() && req.user.role !== ADMIN) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    await attachmentService.delete(id)

    return res.status(204).send()
  } catch (error) {
    console.error(`Error deleting attachment: ${error.message}`)
    return res.status(500).json({ message: 'Error deleting attachment' })
  }
}

module.exports = {
  findMany,
  create,
  findById,
  update,
  delete: deleteAttachment
}
