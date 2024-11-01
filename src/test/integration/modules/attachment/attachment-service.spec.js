const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const Attachment = require('~/modules/attachment/attachment.model')
const attachmentService = require('~/modules/attachment/attachment.service')

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

describe('Attachment Service', () => {
  beforeEach(async () => {
    await Attachment.deleteMany({})
  })

  it('should create multiple attachments from an array', async () => {
    const authorId = new mongoose.Types.ObjectId()
    const data = [
      { name: 'attachment1', size: 123, url: 'http://example.com/file1', author: authorId },
      { name: 'attachment2', size: 456, url: 'http://example.com/file2', author: authorId }
    ]

    const attachments = await attachmentService.create(authorId, data)

    expect(Array.isArray(attachments)).toBe(true)
    expect(attachments.length).toBe(2)
    attachments.forEach((attachment, index) => {
      expect(attachment).toHaveProperty('_id')
      expect(attachment.name).toBe(data[index].name)
      expect(attachment.size).toBe(data[index].size)
      expect(attachment.url).toBe(data[index].url)
      expect(attachment.author).toEqual(data[index].author)
    })
  })

  describe('findMany', () => {
    it('should find all attachments', async () => {
      const authorId = new mongoose.Types.ObjectId()
      const data = { name: 'test attachment', size: 123, url: 'http://example.com/test', author: authorId }
      await attachmentService.create(data.author, data)

      const attachments = await attachmentService.findMany({})
      expect(attachments.items.length).toBe(1)
      expect(attachments.items[0].name).toBe(data.name)
      expect(attachments.items[0].author).toEqual(data.author)
    })
  })

  describe('findById', () => {
    it('should find an attachment by id', async () => {
      const authorId = new mongoose.Types.ObjectId()
      const data = { name: 'test attachment', size: 123, url: 'http://example.com/test', author: authorId }
      const attachment = await attachmentService.create(data.author, data)

      const foundAttachment = await attachmentService.findById(attachment._id)
      expect(foundAttachment).toBeTruthy()
      expect(foundAttachment.name).toBe(data.name)
      expect(foundAttachment.author).toEqual(data.author)
    })
  })

  describe('update', () => {
    it('should update an attachment', async () => {
      const authorId = new mongoose.Types.ObjectId()
      const data = { name: 'test attachment', size: 123, url: 'http://example.com/test', author: authorId }
      const attachment = await attachmentService.create(data.author, data)
      const updatedData = { name: 'updated attachment' }

      const updatedAttachment = await attachmentService.update(attachment._id, updatedData)
      expect(updatedAttachment.name).toBe(updatedData.name)
      expect(updatedAttachment.author).toEqual(data.author)
    })
  })

  describe('delete', () => {
    it('should delete an attachment', async () => {
      const authorId = new mongoose.Types.ObjectId()
      const data = { name: 'test attachment', size: 123, url: 'http://example.com/test', author: authorId }
      const attachment = await attachmentService.create(data.author, data)

      await attachmentService.delete(attachment._id)
      const foundAttachment = await attachmentService.findById(attachment._id)
      expect(foundAttachment).toBeNull()
    })
  })
})
