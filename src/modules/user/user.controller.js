const { createForbiddenError } = require('~/utils/errorsHelper')
const createAggregateOptions = require('~/utils/users/createAggregateOptions')

const userService = require('./user.service')

const findMany = async (req, res) => {
  const { skip, limit, sort, match } = createAggregateOptions(req.query)

  const users = await userService.findMany({ skip, limit, sort, match })
  res.status(200).json(users)
}

const findOneById = async (req, res) => {
  const { id } = req.params
  const { role } = req.query

  const user = await userService.findOneById(id, role)
  res.status(200).json(user)
}

const update = async (req, res) => {
  const { id } = req.params
  const { role } = req.user
  const updateData = req.body

  if (id !== req.user.id) throw createForbiddenError()

  await userService.update(id, role, updateData)
  res.status(204).end()
}

const updateStatus = async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  await userService.updateStatus(id, updateData)
  res.status(204).end()
}

const remove = async (req, res) => {
  const { id } = req.params

  await userService.remove(id)
  res.status(204).end()
}

module.exports = {
  findMany,
  findOneById,
  update,
  updateStatus,
  remove
}
