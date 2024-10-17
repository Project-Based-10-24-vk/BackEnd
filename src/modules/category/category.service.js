const Category = require('./category.model')

const categoryService = {
  create: async (data) => {
    const { name, icon, color } = data
    const newCategory = { name, appearance: { icon, color } }
    const response = await Category.create(newCategory)
    return response
  },
  findAll: async (match) => {
    return await Category.find(match).lean().exec()
  },
  findById: async (id) => {
    return await Category.findById(id).lean().exec()
  }
}

module.exports = categoryService
