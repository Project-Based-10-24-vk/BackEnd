const getMatchOptions = require('~/utils/getMatchOptions')
const getRegex = require('~/utils/getRegex')

const categoryService = require('./category.service')

const findAll = async (req, res) => {
  const { name = '' } = req.query
  const match = getMatchOptions({ name: getRegex(name) })

  const response = await categoryService.findAll(match)
  res.status(200).json(response)
}

const findById = async (req, res) => {
  const { id } = req.params
  const response = await categoryService.findById(id)
  res.status(200).json(response)
}

const create = async (req, res) => {
  const data = req.body
  const response = await categoryService.create(data)
  res.status(201).json(response)
}

module.exports = {
  findAll,
  findById,
  create
}
