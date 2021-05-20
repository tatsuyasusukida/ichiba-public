const http = require('http')
const winston = require('winston')
const {App} = require('../app')
const {LoggerMaker} = require('../util/LoggerMaker')

class Main {
  async run () {
    const loggerMaker = new LoggerMaker()

    winston.loggers.add('error', loggerMaker.makeLogger('error', 'json', 'serve-error.log'))
    winston.loggers.add('warn', loggerMaker.makeLogger('warn', 'json', 'serve-warn.log'))
    winston.loggers.add('info', loggerMaker.makeLogger('info', 'json', 'serve-info.log'))
    winston.loggers.add('debug', loggerMaker.makeLogger('debug', 'json', 'serve-debug.log'))
    winston.loggers.add('access', loggerMaker.makeLogger('info', 'raw', 'serve-access.log'))
    winston.loggers.add('query', loggerMaker.makeLogger('info', 'json', 'serve-query.log'))

    const server = http.createServer()
    const app = new App()

    server.on('listening', app.onListening.bind(app))
    server.on('request', app.onRequest.bind(app))
    server.on('error', app.onError.bind(app))
    server.listen(process.env.PORT)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
  }
}
