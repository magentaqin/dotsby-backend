const chalk = require('chalk')
const config = require('config')
const fs = require('fs')
const path = require('path')
const datetimeHelper = require('./datetimehelper')

const { env, productionEnvs } = config;

class Logger {
  static init() {
    this.accessStream = ''
    this.errorStream = ''
    this.isProd = false

    if (productionEnvs.includes(env)) {
      const streamConfig = {
        flags: 'a',
        encoding: 'utf8',
        fd: null,
        mode: 0o666,
        autoClose: true,
      }

      const logDir = path.resolve(__dirname, '../../', 'logs')

      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
      }

      const accessFilePath = path.resolve(logDir, 'access.log')
      const accessStream = fs.createWriteStream(accessFilePath, streamConfig)

      const errFilePath = path.resolve(logDir, 'error.log')
      const errorStream = fs.createWriteStream(errFilePath, streamConfig)

      this.accessStream = accessStream
      this.errorStream = errorStream
    }
  }


  static info(...msg) {
    const log = `${datetimeHelper.formatUTCDatetime()} ${msg.join(' ')}`
    if (this.isProd) {
      this.accessStream.write(`${log}\n`)
      return
    }

    console.info(chalk.green(log))
  }

  static debug(...msg) {
    const log = msg.join(' ')
    if (this.isProd) {
      this.accessStream.write(`${log}\n`)
      return
    }

    console.log(chalk.white(log))
  }

  static error(...msg) {
    const log = `${datetimeHelper.formatUTCDatetime()} ${msg.join(' ')}`;
    if (this.isProd) {
      this.errorStream.write(`${log}\n`)
      return
    }

    console.error(chalk.red(log))
  }
}

module.exports = Logger
