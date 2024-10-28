const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { FIELD_CANNOT_BE_EMPTY, FIELD_CANNOT_BE_SHORTER, ENUM_CAN_BE_ONE_OF } = require('~/consts/errors')
const {
  enums: { RESOURCES_TYPES_ENUM }
} = require('~/consts/validation')
const Lesson = require('~/modules/lesson/lesson.model')

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

describe('Lesson Model Test', () => {
  it('should create and save a lesson successfully', async () => {
    const validLesson = new Lesson({
      title: 'Sample Lesson',
      description: 'This is a sample lesson description.',
      content: 'This is the content of the sample lesson which is more than 50 characters long.',
      author: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      resourceType: RESOURCES_TYPES_ENUM[0]
    })
    const savedLesson = await validLesson.save()
    expect(savedLesson._id).toBeDefined()
    expect(savedLesson.title).toBe('Sample Lesson')
    expect(savedLesson.description).toBe('This is a sample lesson description.')
    expect(savedLesson.content).toBe('This is the content of the sample lesson which is more than 50 characters long.')
    expect(savedLesson.author).toBeDefined()
    expect(savedLesson.category).toBeDefined()
    expect(savedLesson.resourceType).toBe(RESOURCES_TYPES_ENUM[0])
  })

  it('should fail to create a lesson without required fields', async () => {
    const lessonWithoutRequiredFields = new Lesson({})
    let err
    try {
      await lessonWithoutRequiredFields.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeDefined()
    expect(err.errors.title).toBeDefined()
    expect(err.errors.title.message).toBe(FIELD_CANNOT_BE_EMPTY('title'))
    expect(err.errors.description).toBeDefined()
    expect(err.errors.description.message).toBe(FIELD_CANNOT_BE_EMPTY('description'))
    expect(err.errors.content).toBeDefined()
    expect(err.errors.content.message).toBe(FIELD_CANNOT_BE_EMPTY('content'))
    expect(err.errors.author).toBeDefined()
    expect(err.errors.author.message).toBe(FIELD_CANNOT_BE_EMPTY('author'))
  })

  it('should fail to create a lesson with short content', async () => {
    const lessonWithShortContent = new Lesson({
      title: 'Sample Lesson',
      description: 'This is a sample lesson description.',
      content: 'Short content',
      author: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      resourceType: RESOURCES_TYPES_ENUM[0]
    })
    let err
    try {
      await lessonWithShortContent.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeDefined()
    expect(err.errors.content).toBeDefined()
    expect(err.errors.content.message).toBe(FIELD_CANNOT_BE_SHORTER('content', 50))
  })

  it('should fail to create a lesson with invalid resource type', async () => {
    const lessonWithInvalidResourceType = new Lesson({
      title: 'Sample Lesson',
      description: 'This is a sample lesson description.',
      content: 'This is the content of the sample lesson which is more than 50 characters long.',
      author: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      resourceType: 'INVALID_TYPE'
    })
    let err
    try {
      await lessonWithInvalidResourceType.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeDefined()
    expect(err.errors.resourceType).toBeDefined()
    expect(err.errors.resourceType.message).toBe(ENUM_CAN_BE_ONE_OF('resource type', RESOURCES_TYPES_ENUM))
  })
})
