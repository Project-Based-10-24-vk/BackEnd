const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const subjectService = require('./subject.service')
const Subject = require('./subject.model')

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

describe('Subject Service', () => {
  beforeEach(async () => {
    await Subject.deleteMany({})
  })

  describe('createSubject', () => {
    it('should create a new subject', async () => {
      const data = { name: 'test subject', category: mongoose.Types.ObjectId() }
      const subject = await subjectService.createSubject(data)

      expect(subject).toHaveProperty('_id')
      expect(subject.name).toBe(data.name)
      expect(subject.category.toString()).toBe(data.category.toString())
    })
  })

  describe('getSubjects', () => {
    it('should find all subjects', async () => {
      const data = { name: 'test subject', category: mongoose.Types.ObjectId() }
      await subjectService.createSubject(data)

      const result = await subjectService.getSubjects()
      expect(result.items.length).toBe(1)
      expect(result.items[0].name).toBe(data.name)
    })
  })

  describe('getSubjectById', () => {
    it('should find a subject by id', async () => {
      const data = { name: 'test subject', category: mongoose.Types.ObjectId() }
      const subject = await subjectService.createSubject(data)

      const foundSubject = await subjectService.getSubjectById(subject._id)
      expect(foundSubject).toBeTruthy()
      expect(foundSubject.name).toBe(data.name)
    })
  })

  describe('updateSubject', () => {
    it('should update an existing subject', async () => {
      const data = { name: 'test subject', category: mongoose.Types.ObjectId() }
      const subject = await subjectService.createSubject(data)

      const updatedData = { name: 'updated subject' }
      const updatedSubject = await subjectService.updateSubject(subject._id, updatedData)

      expect(updatedSubject).toBeTruthy()
      expect(updatedSubject.name).toBe(updatedData.name)
    })

    it('should return null if subject to update is not found', async () => {
      const updatedData = { name: 'updated subject' }
      const updatedSubject = await subjectService.updateSubject(mongoose.Types.ObjectId(), updatedData)

      expect(updatedSubject).toBeNull()
    })
  })

  describe('deleteSubject', () => {
    it('should delete a subject', async () => {
      const data = { name: 'test subject', category: mongoose.Types.ObjectId() }
      const subject = await subjectService.createSubject(data)

      const deletedSubject = await subjectService.deleteSubject(subject._id)
      expect(deletedSubject).toBeTruthy()
      expect(deletedSubject._id.toString()).toBe(subject._id.toString())
    })

    it('should return null if subject to delete is not found', async () => {
      const deletedSubject = await subjectService.deleteSubject(mongoose.Types.ObjectId())
      expect(deletedSubject).toBeNull()
    })
  })

  describe('getSubjectsByCategoryId', () => {
    it('should find subjects by category id', async () => {
      const categoryId = mongoose.Types.ObjectId()
      const data = { name: 'test subject', category: categoryId }
      await subjectService.createSubject(data)

      const subjects = await subjectService.getSubjectsByCategoryId(categoryId)
      expect(subjects.length).toBe(1)
      expect(subjects[0].name).toBe(data.name)
    })
  })
})
