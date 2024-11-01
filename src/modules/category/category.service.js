const Category = require('./category.model')
const Subject = require('../subject/subject.model')

const categoryService = {
  create: async (data) => {
    const { name, icon, color } = data
    const newCategory = { name, appearance: { icon, color } }

    return await Category.create(newCategory)
  },
  findMany: async (match) => {
    const items = await Category.find(match).lean().exec()
    const count = await Category.countDocuments(match)

    return { count, items }
  },
  findManyNames: async (match) => {
    const items = await Category.find().select('name').lean().exec()
    const count = await Category.countDocuments(match)

    return { count, items }
  },
  findOneById: async (id) => {
    return await Category.findById(id).lean().exec()
  },
  getSubjectsByCategoryId: async (categoryId, sort, skip = 0, limit = 10) => {
    const items = await Subject.find({ category: categoryId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    const count = await Subject.countDocuments()
    return { count, items }
  },
}

module.exports = categoryService
