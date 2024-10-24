const request = require('supertest')
const express = require('express')
const lessonController = require('~/modules/lesson/lesson.controller')
const lessonService = require('~/modules/lesson/lesson.service')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  req.user = { id: 1 }
  next()
})

app.post('/lessons', lessonController.create)
app.get('/lessons', lessonController.findAll)
app.get('/lessons/:id', lessonController.findById)
app.put('/lessons/:id', lessonController.update)
app.delete('/lessons/:id', lessonController.remove)

jest.mock('~/modules/lesson/lesson.service')

describe('Lesson Controller', () => {
  let server

  beforeAll(() => {
    server = app.listen(4000)
  })

  afterAll((done) => {
    server.close(done)
  })

  describe('POST /lessons', () => {
    it('should create a lesson', async () => {
      const lessonData = { title: 'New Lesson' }
      const createdLesson = { id: 1, ...lessonData }
      lessonService.create.mockResolvedValue(createdLesson)

      const response = await request(app).post('/lessons').send(lessonData)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdLesson)
    })
  })

  describe('GET /lessons', () => {
    it('should return all lessons', async () => {
      const lessons = [{ id: 1, title: 'Lesson 1' }]
      lessonService.findAll.mockResolvedValue(lessons)

      const response = await request(app).get('/lessons')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(lessons)
    })
  })

  describe('GET /lessons/:id', () => {
    it('should return a lesson by id', async () => {
      const lesson = { id: 1, title: 'Lesson 1' }
      lessonService.findById.mockResolvedValue(lesson)

      const response = await request(app).get('/lessons/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(lesson)
    })
  })

  describe('PUT /lessons/:id', () => {
    it('should update a lesson', async () => {
      const lessonData = { title: 'Updated Lesson' }
      const updatedLesson = { id: 1, ...lessonData }
      lessonService.update.mockResolvedValue(updatedLesson)

      const response = await request(app).put('/lessons/1').send(lessonData)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedLesson)
    })
  })

  describe('DELETE /lessons/:id', () => {
    it('should delete a lesson', async () => {
      lessonService.remove.mockResolvedValue()

      const response = await request(app).delete('/lessons/1')

      expect(response.status).toBe(204)
      expect(response.body).toEqual({})
    })
  })
})
