const getMatchOptions = require('~/utils/getMatchOptions')
const getRegex = require('~/utils/getRegex')

const categoryService = require('./category.service')

const findMany = async (req, res) => {
  const { name = '' } = req.query
  const match = getMatchOptions({ name: getRegex(name) })

  const response = await categoryService.findMany(match)
  res.status(200).json(response)
}

const findManyNames = async (req, res) => {
  const response = await categoryService.findManyNames()
  res.status(200).json(response)
}

const findOneById = async (req, res) => {
  const { id } = req.params
  const response = await categoryService.findOneById(id)
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
  create
}
