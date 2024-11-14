const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const getRegex = require('~/utils/getRegex')
const subjectService = require('./subject.service')

const findMany = async (req, res) => {
  const { name = '', category = '', sort, skip = 0, limit = 100 } = req.query

  const match = getMatchOptions({ name: getRegex(name), category })
  const sortOptions = getSortOptions(sort)

  const response = await subjectService.findMany(match, sortOptions, skip, limit)
  res.status(200).json(response)
}

const findManyNames = async (req, res) => {
  const { name = '', category = '', sort, skip = 0, limit = 100 } = req.query

  const match = getMatchOptions({ name: getRegex(name), category })
  const sortOptions = getSortOptions(sort)

  const response = await subjectService.findManyNames(match, sortOptions, skip, limit)
  res.status(200).json(response)
}

const findOneById = async (req, res) => {
  const { id } = req.params

  const response = await subjectService.findOneById(id)
  res.status(200).json(response)
}

const create = async (req, res) => {
  const data = req.body

  const response = await subjectService.create(data)
  res.status(201).json(response)
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body

  const response = await subjectService.update(id, data)
  res.status(200).json(response)
}

const remove = async (req, res) => {
  const { id } = req.params

  await subjectService.remove(id)
  res.status(204).end()
}

module.exports = {
  findMany,
  findManyNames,
  findOneById,
  create,
  update,
  remove
}
