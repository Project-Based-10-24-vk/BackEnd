const Category = require('./category.model')

const categoryService = {
  create: async (data) => {
    const { name, icon, color } = data
    const newCategory = { name, appearance: { icon, color } }

    return await Category.create(newCategory)
  },
  findAll: async (match) => {
    const items = await Category.find(match).lean().exec()
    const count = await Category.countDocuments(match)

    return { count, items }
  },
  findAllNames: async (match) => {
    const items = await Category.find().select('name').lean().exec()
    const count = await Category.countDocuments(match)

    return { count, items }
  },
  findById: async (id) => {
    return await Category.findById(id).lean().exec()
  }
}

module.exports = categoryService
