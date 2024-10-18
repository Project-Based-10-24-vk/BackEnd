const categoryService = require('~/modules/category/category.service')
const Category = require('~/modules/category/category.model')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Category Service', () => {
  beforeEach(async () => {
    await Category.deleteMany({})
  })

  describe('create', () => {
    it('should create a new category', async () => {
      const data = { name: 'test category', icon: 'test-icon', color: '#dddddd' }
      const category = await categoryService.create(data)

      expect(category).toHaveProperty('_id')
      expect(category.name).toBe(data.name)
      expect(category.appearance.icon).toBe(data.icon)
      expect(category.appearance.color).toBe(data.color)
    })
  })

  describe('findAll', () => {
    it('should find all categories', async () => {
      const data = { name: 'test category', icon: 'test-icon', color: '#dddddd' }
      await categoryService.create(data)

      const categories = await categoryService.findAll({})
      expect(categories.length).toBe(1)
      expect(categories[0].name).toBe(data.name)
    })
  })

  describe('findById', () => {
    it('should find a category by id', async () => {
      const data = { name: 'test category', icon: 'test-icon', color: '#dddddd' }
      const category = await categoryService.create(data)

      const foundCategory = await categoryService.findById(category._id)
      expect(foundCategory).toBeTruthy()
      expect(foundCategory.name).toBe(data.name)
    })
  })
})
