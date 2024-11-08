const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { createClient } = require('@supabase/supabase-js')
jest.mock('@supabase/supabase-js')
const mockSupabaseClient = {
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
      list: jest.fn().mockResolvedValue({ data: [], error: null }),
      remove: jest.fn().mockResolvedValue({ error: null })
    })
  }
}
createClient.mockReturnValue(mockSupabaseClient)
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

  it('should create a single attachment', async () => {
    const authorId = new mongoose.Types.ObjectId()
    const data = {
      name: 'attachment1',
      size: 123,
      url: 'http://example.com/file1',
      extension: 'jpg',
      author: authorId
    }

    const attachment = await attachmentService.create(authorId, data)

    expect(attachment).toHaveProperty('_id')
    expect(attachment.name).toBe(data.name)
    expect(attachment.size).toBe(data.size)
    expect(attachment.url).toBe(data.url)
    expect(attachment.extension).toBe(data.extension)
    expect(attachment.author).toEqual(data.author)
  })

  describe('findMany', () => {
    it('should find all attachments', async () => {
      const authorId = new mongoose.Types.ObjectId()
      const data = {
        name: 'test attachment',
        size: 123,
        url: 'http://example.com/test',
        extension: 'jpg',
        author: authorId
      }
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
      const data = {
        name: 'test attachment',
        size: 123,
        url: 'http://example.com/test',
        extension: 'jpg',
        author: authorId
      }
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
      const data = {
        name: 'test attachment',
        size: 123,
        url: 'http://example.com/test',
        extension: 'jpg',
        author: authorId
      }
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
      const data = {
        name: 'test attachment',
        size: 123,
        url: 'http://example.com/test',
        extension: 'jpg',
        author: authorId
      }
      const attachment = await attachmentService.create(data.author, data)

      await attachmentService.delete(attachment._id)
      const foundAttachment = await attachmentService.findById(attachment._id)
      expect(foundAttachment).toBeNull()
    })
  })
})
