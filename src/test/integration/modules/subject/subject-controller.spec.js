const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const subjectController = require('./subject.controller')
const subjectService = require('./subject.service')

jest.mock('./subject.service')

const app = express()
app.use(bodyParser.json())
app.get('/subjects', subjectController.subjectFind)
app.get('/subjects/:id', subjectController.subjectFindById)
app.post('/subjects', subjectController.subjectCreate)
app.put('/subjects/:id', subjectController.subjectUpdate)
app.delete('/subjects/:id', subjectController.subjectDelete)
app.get('/subjects/category/:categoryId', subjectController.subjectFindByCategoryId)

describe('Subject Controller', () => {
  describe('GET /subjects', () => {
    it('should return all subjects', async () => {
      const mockSubjects = [{ id: 1, name: 'Subject 1' }]
      subjectService.getSubjects.mockResolvedValue(mockSubjects)

      const response = await request(app).get('/subjects')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSubjects)
    })
  })

  describe('GET /subjects/:id', () => {
    it('should return a subject by id', async () => {
      const mockSubject = { id: 1, name: 'Subject 1' }
      subjectService.getSubjectById.mockResolvedValue(mockSubject)

      const response = await request(app).get('/subjects/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSubject)
    })

    it('should return 404 if subject is not found', async () => {
      subjectService.getSubjectById.mockResolvedValue(null)

      const response = await request(app).get('/subjects/999')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Subject not found' })
    })
  })

  describe('POST /subjects', () => {
    it('should create a new subject', async () => {
      const newSubject = { name: 'New Subject' }
      const createdSubject = { id: 1, ...newSubject }
      subjectService.createSubject.mockResolvedValue(createdSubject)

      const response = await request(app).post('/subjects').send(newSubject)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdSubject)
    })
  })

  describe('PUT /subjects/:id', () => {
    it('should update an existing subject', async () => {
      const updatedSubject = { id: 1, name: 'Updated Subject' }
      subjectService.updateSubject.mockResolvedValue(updatedSubject)

      const response = await request(app).put('/subjects/1').send({ name: 'Updated Subject' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedSubject)
    })

    it('should return 404 if subject to update is not found', async () => {
      subjectService.updateSubject.mockResolvedValue(null)

      const response = await request(app).put('/subjects/999').send({ name: 'Non-existent Subject' })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Subject not found' })
    })
  })

  describe('DELETE /subjects/:id', () => {
    it('should delete a subject', async () => {
      subjectService.deleteSubject.mockResolvedValue({ id: 1 })

      const response = await request(app).delete('/subjects/1')

      expect(response.status).toBe(204)
    })

    it('should return 404 if subject to delete is not found', async () => {
      subjectService.deleteSubject.mockResolvedValue(null)

      const response = await request(app).delete('/subjects/999')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Subject not found' })
    })
  })

  describe('GET /subjects/category/:categoryId', () => {
    it('should return subjects by category id', async () => {
      const mockSubjects = [{ id: 1, name: 'Subject 1', categoryId: '123' }]
      subjectService.getSubjectsByCategoryId.mockResolvedValue(mockSubjects)

      const response = await request(app).get('/subjects/category/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSubjects)
    })
  })
})
