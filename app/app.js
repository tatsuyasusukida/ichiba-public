const path = require('path')
const querystring = require('querystring')
const helmet = require('helmet')
const morgan = require('morgan')
const nocache = require('nocache')
const winston = require('winston')
const express = require('express')
const proxyMiddleware = require('proxy-middleware')

class App {
  constructor () {
    this.router = express()
    this.router.set('strict routing', true)
    this.router.set('views', path.join(__dirname, 'view'))
    this.router.set('view engine', 'pug')
    this.router.set('trust proxy', true)
    this.router.use(helmet())
    this.router.use(morgan(process.env.LOG_ACCESS, {
      stream: {
        write: message => {
          winston.loggers.get('access').info(message.trim())
        },
      },
    }))

    this.router.use(this.onRequestInitialize.bind(this))

    if (process.env.PROXY === '1') {
      this.router.use('/static/', proxyMiddleware('http://127.0.0.1:8080/'))
    } else {
      this.router.use('/static/', express.static(path.join(__dirname, 'static')))
    }

    this.router.get('/', (req, res) => res.render('home'))
    this.router.get('/layout/', (req, res) => res.render('layout'))
    this.router.get('/article/', (req, res) => res.render('article'))

    this.router.use('/api/v1/', nocache())
    this.router.use('/api/v1/', express.json())

    this.router.use(this.onNotFound.bind(this))
    this.router.use(this.onInternalServerError.bind(this))
  }

  onListening () {
    winston.loggers.get('info').info(`Listening on ${process.env.PORT}`)
  }

  onRequest (req, res) {
    this.router(req, res)
  }

  onRequestInitialize (req, res, next) {
    req.locals = {}
    res.locals.env = process.env
    res.locals.req = req
    res.locals.url = new URL(req.originalUrl, process.env.BASE_URL)

    next()
  }

  onNotFound (req, res) {
    res.status(404).end()
  }

  onInternalServerError (err, req, res, next) {
    res.status(500).end()
    this.onError(err)
  }

  onError (err) {
    winston.loggers.get('error').error(err.message)
    winston.loggers.get('debug').debug(err.stack)
  }
}

module.exports.App = App
