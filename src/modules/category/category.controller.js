const getMatchOptions = require('~/utils/getMatchOptions')
const getRegex = require('~/utils/getRegex')
const getSortOptions = require('~/utils/getSortOptions')

const categoryService = require('./category.service')

const findMany = async (req, res) => {
  const { name = '', sort, skip = 0, limit = 5 } = req.query

  const match = getMatchOptions({ name: getRegex(name) })
  const sortOptions = getSortOptions(sort)

  const response = await categoryService.findMany(match, sortOptions, skip, limit)
  res.status(200).json(response)
}

const findManyNames = async (req, res) => {
  const { name = '', sort, skip = 0, limit = 100 } = req.query

  const match = getMatchOptions({ name: getRegex(name) })
  const sortOptions = getSortOptions(sort)

  const response = await categoryService.findManyNames(match, sortOptions, skip, limit)
  res.status(200).json(response)
}

const findOneById = async (req, res) => {
  const { id } = req.params
  const response = await categoryService.findOneById(id)
  res.status(200).json(response)
}

const subjectsFindByCategoryId = async (req, res) => {
  const { id } = req.params
  const { sort = '', skip, limit } = req.query
  const sortOptions = getSortOptions(sort)
  const response = await categoryService.getSubjectsByCategoryId(id, sortOptions, skip, limit)

  res.status(200).json(response)
}

const create = async (req, res) => {
  const data = req.body
  const response = await categoryService.create(data)
  res.status(201).json(response)
}

module.exports = {
  findMany,
  findManyNames,
  findOneById,
  create,
  subjectsFindByCategoryId
}
