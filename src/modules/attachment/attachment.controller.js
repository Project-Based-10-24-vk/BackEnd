const getMatchOptions = require('~/utils/getMatchOptions')
const getRegex = require('~/utils/getRegex')
const {
  roles: { ADMIN }
} = require('~/consts/auth')
const attachmentService = require('./attachment.service')

const findMany = async (req, res) => {
  const { name = '', authorId } = req.query
  const matchOptions = { name: getRegex(name) }

  if (authorId) {
    matchOptions.author = authorId
  }

  const response = await attachmentService.findMany(getMatchOptions(matchOptions))
  res.status(200).json(response)
}

const create = async (req, res) => {
  const { id: author } = req.user
  const data = req.body

  const response = await attachmentService.create(author, data)
  res.status(201).json(response)
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

  const attachment = await attachmentService.findById(id)

  if (!attachment) {
    return res.status(404).json({ message: 'Attachment not found' })
  }

  if (req.user.id !== attachment.author.toString() && req.user.role !== ADMIN) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  await attachmentService.delete(id)
  res.status(204).send()
}

module.exports = {
  findMany,
  create,
  findById,
  update,
  delete: deleteAttachment
}
