const { createForbiddenError, createNotFoundError } = require('~/utils/errorsHelper')
const Lesson = require('./lesson.model')

const lessonService = {
  create: async (author, data) => {
    return await Lesson.create({
      author,
      ...data
    })
  },

  findMany: async () => {
    const count = await Lesson.countDocuments().exec()
    const items = await Lesson.find().lean().exec()

    return { count, items }
  },

  findOneById: async (id) => {
    return await Lesson.findById(id).lean().exec()
  },

  update: async (id, author, data) => {
    const lesson = await lessonService.findById(id)

    if (!lesson) {
      throw createNotFoundError()
    }
    if (lesson.author !== author.toString()) {
      throw createForbiddenError()
    }

    return await Lesson.findOneAndUpdate({ _id: id, author: author.toString() }, { $set: data }, { new: true })
      .lean()
      .exec()
  },

  remove: async (id, author) => {
    const lesson = await lessonService.findById(id)

    if (!lesson) {
      throw createNotFoundError()
    }
    if (lesson.author !== author.toString()) {
      throw createForbiddenError()
    }

    await Lesson.findOneAndDelete({ _id: id, author: author.toString() }).exec()
  }
}

module.exports = lessonService
