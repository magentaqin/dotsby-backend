const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const config = require('config')
const cors = require('@koa/cors');

const Logger = require('./utils/logger')
const datetimeHelper = require('./utils/datetimehelper')
const routers = require('./routers')

/**
 * Logger
 */
Logger.init();
// log server related errors
const errLogger = (err, ctx) => {
  const { status } = ctx.response;
  if (status < 500) {
    return;
  }

  const logString = `------------------------------------------------------
  UTC time: ${datetimeHelper.formatUTCDatetime()}
  Error Catched: ${err.stack}
  Response: ${JSON.stringify(ctx.response)}
  ------------------------------------------------------`

  Logger.error(logString)
}

const debugLogger = (ctx, ms) => {
  const logString = `------------------------------------------------------
  UTC time: ${datetimeHelper.formatUTCDatetime()}
  ${ctx.method}    ${ctx.url} --- ${ctx.status}  ---  ${ms}ms
  ---------------------------------------------------------------`

  Logger.debug(logString)
}


const app = new Koa();

/**
 * Middlewares
 */
app.use(async(ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  debugLogger(ctx, ms)
})


const corsOptions = {
  origin: 'http://localhost:3000',
}

app.use(cors(corsOptions))


app.use(bodyParser({
  strict: true,
}));
app.use(routers);

/**
 * Handle error
 */
app.on('error', (err, ctx) => { errLogger(err, ctx) })

let server = null

const startServer = async() => {
  server = app.listen(config.port)
  if (server.listening) {
    Logger.info(`Server started at ${config.localhost}:${config.port}`)
  }
  server.on('close', () => Logger.info('Server stopped.'))
}

const stopServer = async() => {
  Logger.debug('Closing connections...')
  server.close()
}

module.exports = {
  start: startServer,
  stop: stopServer,
}
