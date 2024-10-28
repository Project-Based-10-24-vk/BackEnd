const { ObjectId } = require('mongodb')
const { createForbiddenError } = require('~/utils/errorsHelper')
const Lesson = require('~/modules/lesson/lesson.model')
const lessonService = require('~/modules/lesson/lesson.service')

jest.mock('~/modules/lesson/lesson.model')
jest.mock('~/utils/errorsHelper')

describe('lessonService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new lesson', async () => {
      const author = new ObjectId()
      const data = { title: 'New Lesson' }
      const createdLesson = { _id: new ObjectId(), author, ...data }

      Lesson.create.mockResolvedValue(createdLesson)

      const result = await lessonService.create(author, data)

      expect(Lesson.create).toHaveBeenCalledWith({ author, ...data })
      expect(result).toEqual(createdLesson)
    })
  })

  describe('findAll', () => {
    it('should return all lessons', async () => {
      const lessons = [
        { _id: new ObjectId(), title: 'Lesson 1' },
        { _id: new ObjectId(), title: 'Lesson 2' }
      ]

      Lesson.find.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(lessons)
      })

      const result = await lessonService.findAll()

      expect(Lesson.find).toHaveBeenCalled()
      expect(result).toEqual(lessons)
    })
  })

  describe('findById', () => {
    it('should return a lesson by id', async () => {
      const id = new ObjectId()
      const lesson = { _id: id, title: 'Lesson' }

      Lesson.findById.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(lesson)
      })

      const result = await lessonService.findById(id)

      expect(Lesson.findById).toHaveBeenCalledWith(id)
      expect(result).toEqual(lesson)
    })
  })

  describe('update', () => {
    it('should update a lesson if the author matches', async () => {
      const id = new ObjectId()
      const author = new ObjectId()
      const data = { title: 'Updated Lesson' }
      const lesson = { _id: id, author: author.toString() }
      const updatedLesson = { _id: id, author: author.toString(), ...data }

      Lesson.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(lesson)
      })
      Lesson.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedLesson)
      })

      const result = await lessonService.update(id, author, data)

      expect(Lesson.findById).toHaveBeenCalledWith(id)
      expect(Lesson.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: id, author: author.toString() },
        { $set: data },
        { new: true }
      )
      expect(result).toEqual(updatedLesson)
    })

    it('should throw a forbidden error if the author does not match', async () => {
      const id = new ObjectId()
      const author = new ObjectId()
      const data = { title: 'Updated Lesson' }
      const lesson = { _id: id, author: new ObjectId().toString() }

      Lesson.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(lesson)
      })
      createForbiddenError.mockImplementation(() => new Error('Forbidden'))

      await expect(lessonService.update(id, author, data)).rejects.toThrow('Forbidden')

      expect(Lesson.findById).toHaveBeenCalledWith(id)
      expect(createForbiddenError).toHaveBeenCalled()
      expect(Lesson.findOneAndUpdate).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a lesson if the author matches', async () => {
      const id = new ObjectId()
      const author = new ObjectId()
      const lesson = { _id: id, author: author.toString() }

      Lesson.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(lesson)
      })
      Lesson.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      })

      await lessonService.remove(id, author)

      expect(Lesson.findById).toHaveBeenCalledWith(id)
      expect(Lesson.findOneAndDelete).toHaveBeenCalledWith({ _id: id, author: author.toString() })
    })

    it('should throw a forbidden error if the author does not match', async () => {
      const id = new ObjectId()
      const author = new ObjectId()
      const lesson = { _id: id, author: new ObjectId().toString() }

      Lesson.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(lesson)
      })
      createForbiddenError.mockImplementation(() => new Error('Forbidden'))

      await expect(lessonService.remove(id, author)).rejects.toThrow('Forbidden')

      expect(Lesson.findById).toHaveBeenCalledWith(id)
      expect(createForbiddenError).toHaveBeenCalled()
      expect(Lesson.findOneAndDelete).not.toHaveBeenCalled()
    })
  })
})
