const { createForbiddenError, createNotFoundError } = require('~/utils/errorsHelper')
const Lesson = require('./lesson.model')

const lessonService = {
  create: async (author, data) => {
    return await Lesson.create({
      author,
      ...data
    })
  },

  findAll: async () => {
    return await Lesson.find().lean().exec()
  },

  findById: async (id) => {
    return await Lesson.findById(id).lean().exec()
  },

  update: async (id, author, data) => {
    const lesson = await Lesson.findById(id).exec()

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
    const lesson = await Lesson.findById(id).exec()
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
