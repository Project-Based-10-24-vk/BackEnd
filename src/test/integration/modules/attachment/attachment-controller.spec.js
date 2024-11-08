const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
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
const attachmentController = require('~/modules/attachment/attachment.controller')
const attachmentService = require('~/modules/attachment/attachment.service')
const supabaseService = require('~/services/supabase')

jest.mock('~/modules/attachment/attachment.service', () => ({
  findMany: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}))

const app = express()
app.use(bodyParser.json())
app.get('/attachments', attachmentController.findMany)
app.get('/attachments/:id', attachmentController.findById)
app.post('/attachments', attachmentController.create)

describe('Attachment Controller', () => {
  describe('GET /attachments', () => {
    it('should return all attachments', async () => {
      const mockAttachments = [{ id: 1, title: 'Attachment 1' }]
      attachmentService.findMany.mockResolvedValue(mockAttachments)

      const response = await request(app).get('/attachments')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockAttachments)
    })

    it('should return attachments filtered by authorId', async () => {
      const mockAttachments = [{ id: 1, title: 'Attachment 1', authorId: 'authorId' }]
      attachmentService.findMany.mockResolvedValue(mockAttachments)

      const response = await request(app).get('/attachments').query({ authorId: 'authorId' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockAttachments)
    })
  })

  describe('GET /attachments/:id', () => {
    it('should return an attachment by id', async () => {
      const mockAttachment = { id: 1, title: 'Attachment 1' }
      attachmentService.findById.mockResolvedValue(mockAttachment)

      const response = await request(app).get('/attachments/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockAttachment)
    })
  })

  describe('POST /attachments', () => {
    it('should create new attachments when files are uploaded', async () => {
      const req = {
        user: { id: 'authorId' },
        files: [
          { originalname: 'file1.jpg', size: 1000 },
          { originalname: 'file2.jpg', size: 1500 }
        ]
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      const mockUploadedFiles = [
        { url: 'http://example.com/file1.jpg', extension: 'jpg' },
        { url: 'http://example.com/file2.jpg', extension: 'jpg' }
      ]

      const mockNewAttachments = [
        { name: 'file1.jpg', size: 1000, url: 'http://example.com/file1.jpg', extension: 'jpg' },
        { name: 'file2.jpg', size: 1500, url: 'http://example.com/file2.jpg', extension: 'jpg' }
      ]

      attachmentService.uploadToStorage = jest
        .fn()
        .mockResolvedValueOnce(mockUploadedFiles[0])
        .mockResolvedValueOnce(mockUploadedFiles[1])

      attachmentService.create = jest
        .fn()
        .mockResolvedValueOnce(mockNewAttachments[0])
        .mockResolvedValueOnce(mockNewAttachments[1])

      await attachmentController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockNewAttachments)
    })

    it('should return 400 if no files are uploaded', async () => {
      const req = {
        user: { id: 'authorId' },
        files: []
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      await attachmentController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'No files uploaded.' })
    })

    it('should return 500 if there is an error during file upload or creation', async () => {
      const req = {
        user: { id: 'authorId' },
        files: [{ originalname: 'file1.jpg', size: 1000 }]
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      supabaseService.uploadAttachment = jest.fn().mockRejectedValue(new Error('File upload failed'))

      await attachmentController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'File upload failed' })
    })
  })

  describe('DELETE /attachments/:id', () => {
    it('should delete an attachment', async () => {
      const mockAttachment = { id: 1, title: 'Attachment 1', author: 'authorId' }

      attachmentService.findById.mockResolvedValue(mockAttachment)
      attachmentService.delete.mockResolvedValue()

      const req = {
        user: { id: 'authorId' },
        params: { id: '1' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await attachmentController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })

    it('should return 404 if attachment not found', async () => {
      attachmentService.findById.mockResolvedValue(null)

      const req = {
        user: { id: 'authorId' },
        params: { id: '1' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      await attachmentController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Attachment not found' })
    })

    it('should return 403 if user is not the author and not an admin', async () => {
      const mockAttachment = { id: 1, title: 'Attachment 1', author: 'anotherId' }
      attachmentService.findById.mockResolvedValue(mockAttachment)

      const req = {
        user: { id: 'notAuthorId', role: 'user' },
        params: { id: '1' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      await attachmentController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' })
    })
  })
})
