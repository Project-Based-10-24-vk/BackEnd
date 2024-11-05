const mongoose = require('mongoose')
const Attachment = require('~/modules/attachment/attachment.model')

describe('Attachment Model Test', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  it('should create & save attachment successfully', async () => {
    const authorId = new mongoose.Types.ObjectId()
    const validAttachment = new Attachment({
      name: 'testattachment',
      author: authorId,
      size: 123,
      url: 'http://mocked-url.com',
      extension: 'jpg'
    })

    const savedAttachment = await validAttachment.save()

    expect(savedAttachment._id).toBeDefined()
    expect(savedAttachment.name).toBe('testattachment')
    expect(savedAttachment.author.toString()).toBe(authorId.toString())
    expect(savedAttachment.size).toBe(123)
    expect(savedAttachment.url).toBe('http://mocked-url.com')
    expect(savedAttachment.extension).toBe('jpg')
  })

  it('should fail to create attachment without required fields', async () => {
    const attachmentWithoutRequiredField = new Attachment({ name: '' })
    let err
    try {
      await attachmentWithoutRequiredField.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors.name).toBeDefined()
  })
})
