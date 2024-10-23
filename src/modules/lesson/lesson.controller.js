const lessonService = require('./lesson.service')

const create = async (req, res) => {
  const { id: author } = req.user
  const data = req.body

  const response = await lessonService.create(author, data)
  res.status(201).json(response)
}

const findAll = async (req, res) => {
  const response = await lessonService.findAll()
  res.status(200).json(response)
}

const findById = async (req, res) => {
  const { id } = req.params

  const response = await lessonService.findById(id)
  res.status(200).json(response)
}

const update = async (req, res) => {
  const { id: author } = req.user
  const { id } = req.params
  const data = req.body

  const response = await lessonService.update(id, author, data)
  res.status(200).json(response)
}

const remove = async (req, res) => {
  const { id: author } = req.user
  const { id } = req.params

  await lessonService.remove(id, author)
  res.status(204).end()
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
}
