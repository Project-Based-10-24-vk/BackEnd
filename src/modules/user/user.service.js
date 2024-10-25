const { DOCUMENT_NOT_FOUND, ALREADY_REGISTERED } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const filterAllowedFields = require('~/utils/filterAllowedFields')

const User = require('./user.model')
const { allowedUserFieldsForUpdate } = require('./user.schemas')

const userService = {
  findMany: async ({ match, sort, skip, limit }) => {
    const count = await User.countDocuments(match)
    const items = await User.find(match)
      .select('+status')
      .sort(sort)
      .collation({ locale: 'en_US', strength: 2, caseLevel: false })
      .skip(skip)
      .limit(limit)
      .exec()

    return {
      items,
      count
    }
  },

  findOneById: async (id, role) => {
    return await User.findOne({ _id: id, ...(role && { role }) })
      .select('+lastLoginAs +isEmailConfirmed +isFirstLogin')
      .lean()
      .exec()
  },

  findOneByEmail: async (email) => {
    const user = await User.findOne({ email })
      .select('+password +lastLoginAs +isEmailConfirmed +isFirstLogin +appLanguage')
      .lean()
      .exec()

    if (!user) {
      return null
    }

    return user
  },

  create: async (role, firstName, lastName, email, password, appLanguage, isEmailConfirmed = false) => {
    const duplicateUser = await userService.findOneByEmail(email)

    if (duplicateUser) {
      throw createError(409, ALREADY_REGISTERED)
    }

    return await User.create({
      role,
      firstName,
      lastName,
      email,
      lastLoginAs: role,
      password,
      appLanguage,
      isEmailConfirmed
    })
  },

  privateUpdate: async (id, param) => {
    const user = await User.findByIdAndUpdate(id, param, { new: true }).exec()

    if (!user) {
      throw createError(404, DOCUMENT_NOT_FOUND([User.modelName]))
    }
  },

  update: async (id, role, updateData) => {
    const filteredUpdateData = filterAllowedFields(updateData, allowedUserFieldsForUpdate)

    const user = await User.findById(id).lean().exec()

    if (!user) {
      throw createError(404, DOCUMENT_NOT_FOUND([User.modelName]))
    }

    filteredUpdateData.mainSubjects = { ...user.mainSubjects, [role]: updateData.mainSubjects }

    await User.findByIdAndUpdate(id, filteredUpdateData, { new: true, runValidators: true }).lean().exec()
  },

  updateStatus: async (id, updateStatus) => {
    const statusesForChange = {}

    for (const role in updateStatus) {
      statusesForChange['status.' + role] = updateStatus[role]
    }

    const user = await User.findByIdAndUpdate(id, { $set: statusesForChange }, { new: true }).lean().exec()

    if (!user) {
      throw createError(404, DOCUMENT_NOT_FOUND([User.modelName]))
    }
  },

  remove: async (id) => {
    await User.findByIdAndRemove(id).exec()
  }
}

module.exports = userService
