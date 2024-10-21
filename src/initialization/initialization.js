const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

const {
  config: { CLIENT_URL, SERVER_URL }
} = require('~/configs/config')
const router = require('~/routes')
const { createNotFoundError } = require('~/utils/errorsHelper')
const errorMiddleware = require('~/middlewares/error')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Space2Study',
      version: '1.0.0',
      description: 'Space2Study API documentation'
    },
    servers: [
      {
        url: SERVER_URL
      }
    ],
    components: {
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          code: {
            type: 'string'
          }
        }
      },
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'Access token'
        }
      }
    },
    security: [
      {
        cookieAuth: []
      },
      {
        basicAuth: []
      }
    ]
  },
  apis: [path.join(process.cwd(), '/docs/*.yaml')]
}
const swaggerSettings = swaggerJsDoc(swaggerOptions)

const initialization = (app) => {
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'development' ? true : CLIENT_URL,
      credentials: true,
      methods: 'GET, POST, PATCH, DELETE',
      allowedHeaders: 'Content-Type, Authorization'
    })
  )

  app.use('/', router)
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSettings, { explorer: true }))

  app.use((_req, _res, next) => {
    next(createNotFoundError())
  })

  app.use(errorMiddleware)
}

module.exports = initialization
