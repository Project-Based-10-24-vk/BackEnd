const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const categoryController = require('~/modules/category/category.controller')
const categoryService = require('~/modules/category/category.service')

jest.mock('~/modules/category/category.service')

const app = express()
app.use(bodyParser.json())
app.get('/categories', categoryController.findAll)
app.get('/categories/:id', categoryController.findById)
app.post('/categories', categoryController.create)

describe('Category Controller', () => {
  describe('GET /categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ id: 1, name: 'Category 1' }]
      categoryService.findAll.mockResolvedValue(mockCategories)

      const response = await request(app).get('/categories')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockCategories)
    })

    it('should return categories filtered by name', async () => {
      const mockCategories = [{ id: 1, name: 'Category 1' }]
      categoryService.findAll.mockResolvedValue(mockCategories)

      const response = await request(app).get('/categories').query({ name: 'Category' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockCategories)
    })
  })

  describe('GET /categories/:id', () => {
    it('should return a category by id', async () => {
      const mockCategory = { id: 1, name: 'Category 1' }
      categoryService.findById.mockResolvedValue(mockCategory)

      const response = await request(app).get('/categories/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockCategory)
    })
  })

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      const newCategory = { name: 'New Category' }
      const createdCategory = { id: 1, ...newCategory }
      categoryService.create.mockResolvedValue(createdCategory)

      const response = await request(app).post('/categories').send(newCategory)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdCategory)
    })
  })
})
