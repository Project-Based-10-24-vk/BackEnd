const { createNotFoundError } = require('~/utils/errorsHelper')
const Subject = require('./subject.model')

const subjectService = {
  findMany: async (match, sort, skip, limit) => {
    const count = await Subject.countDocuments(match)
    const items = await Subject.find(match)
      .collation({ locale: 'en', strength: 1 })
      .populate([{ path: 'category', select: 'name' }])
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()

    return { count, items }
  },

  findOneById: async (id) => {
    return await Subject.findById(id).lean().exec()
  },

  create: async (data) => {
    const subject = new Subject(data)
    await subject.save()

    return subject
  },

  update: async (id, data) => {
    const subject = await subjectService.findOneById(id)
    if (!subject) {
      throw createNotFoundError()
    }

    return await Subject.findByIdAndUpdate(id, data, { new: true })
  },

  remove: async (id) => {
    const subject = await subjectService.findOneById(id)
    if (!subject) {
      throw createNotFoundError()
    }

    return Subject.findByIdAndDelete(id)
  }
}

module.exports = subjectService
