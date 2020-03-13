const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const config = require('config')
const cors = require('@koa/cors');

const { dbConnection, connectDB, reconnect } = require('@app/db/init');

const Logger = require('./utils/logger')
const datetimeHelper = require('./utils/datetimehelper')
const routers = require('./routers')
const Token = require('@app/utils/token');

const { jwt_secret_key } = config;

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

// verify token
app.use(async(ctx, next) => {
  const { headers } = ctx.request;
  let isTokenValid = false;
  if (headers.authorization) {
    const token = headers.authorization;
    const tokenInstance = new Token(jwt_secret_key)
    isTokenValid = tokenInstance.verify(token)
    if (isTokenValid) {
      ctx.tokenPayload = tokenInstance.decoded;
      ctx.token = token;
    }
  }
  ctx.isTokenValid = isTokenValid;
  await next();
})

/**
 * Handle error
 */
app.on('error', (err, ctx) => { errLogger(err, ctx) })

let server = null

const startServer = async() => {
  server = app.listen(config.port)
  if (server.listening) {
    Logger.info(`Server started at ${config.host}:${config.port}`)
    const isConnected = await connectDB().catch((err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        reconnect();
      }
    });
    if (isConnected) {
      app.use(bodyParser({ strict: true }));

      // only allow in dev mode.
      if (config.env === 'development') {
        const corsOptions = {
          origin: '*',
        }
        app.use(cors(corsOptions))
      }

      app.use(routers);
    }
  }
  server.on('close', () => {
    dbConnection.end((err) => {
      if (err) {
        Logger.error('DB close err: ', err.message)
        return;
      }
      Logger.info('Server Stopped Successfully.')
    })
  })
}

const stopServer = async() => {
  Logger.debug('Closing connections...')
  server.close()
}

module.exports = {
  start: startServer,
  stop: stopServer,
}
