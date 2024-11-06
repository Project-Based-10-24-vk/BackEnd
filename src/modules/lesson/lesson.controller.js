const lessonService = require('./lesson.service')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const getRegex = require('~/utils/getRegex')
const qs = require('qs')

const create = async (req, res) => {
  const { id: author } = req.user
  const data = req.body

  const response = await lessonService.create(author, data)
  res.status(201).json(response)
}

const findMany = async (req, res) => {
  const parsedQuery = qs.parse(req.query)
  const { name = '', category = '', sort, skip = 0, limit = 5 } = parsedQuery

  const match = getMatchOptions({ title: getRegex(name), category })
  const sortOptions = getSortOptions(sort)

  const response = await lessonService.findMany(match, sortOptions, skip, limit)
  res.status(200).json(response)
}

const findManyOwn = async (req, res) => {
  const { id: author } = req.user
  const parsedQuery = qs.parse(req.query)
  const { name = '', category = '', sort, skip = 0, limit = 5 } = parsedQuery

  const match = getMatchOptions({ author, title: getRegex(name), category })
  const sortOptions = getSortOptions(sort)

  const response = await lessonService.findMany(match, sortOptions, skip, limit)

  res.status(200).json(response)
}

const findOneById = async (req, res) => {
  const { id } = req.params

  const response = await lessonService.findOneById(id)
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
  findMany,
  findManyOwn,
  findOneById,
  update,
  remove
}
