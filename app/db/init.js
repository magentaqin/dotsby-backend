const mysql = require('mysql');
const config = require('config');

const Logger = require('@app/utils/logger');
const createUserTable = require('@app/db/user');
const createDocTable = require('@app/db/doc');
const createSectionTable = require('@app/db/section');
const createPageTable = require('@app/db/page');
const createApiItemTable = require('@app/db/api_item');
const createAnchorPageTable = require('@app/db/anchor_page');

const {
  host, user, password, database, port,
} = config.db;

const handleDatabaseErr = (tableName, err) => {
  Logger.error(`Fail to create ${tableName} table`, err.message);
}

class DBInitializer {
  constructor() {
    this.connection = {
      instance: this.getConnection(),
    };
  }

  // create new connection and add error listener to it.
  getConnection = () => {
    const connection = mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
    });
    connection.on('error', (err) => {
      Logger.error('DB error: ', err);
      this.reconnect();
    })
    return connection;
  }

  connectDB = () => {
    return new Promise((resolve, reject) => {
      this.connection.instance.connect((error) => {
        if (error) {
          Logger.error('DB connection error: ', error.code, error.message);
          return reject(error)
        }

        Logger.info('Successfully connected to db.');
        this.createTables();

        resolve(true);
      });
    })
  }

  reconnect = () => {
    console.log('reconnecting...')
    // destroy old connection
    this.connection.instance && this.connection.instance.destroy();
    // recreate new connection
    this.connection.instance = this.getConnection();
    this.connection.instance.connect((error) => {
      if (error) {
        return Logger.error('DB reconnect error: ', error.code, error.message);
      }
      Logger.info('Successfully re-connected to db.');
    })
  }

  createTables = () => {
    this.connection.instance.query(createUserTable, (err) => err && handleDatabaseErr('users', err));
    this.connection.instance.query(createDocTable, (err) => err && handleDatabaseErr('docs', err));
    this.connection.instance.query(createSectionTable, (err) => err && handleDatabaseErr('sections', err));
    this.connection.instance.query(createPageTable, (err) => err && handleDatabaseErr('pages', err));
    this.connection.instance.query(createAnchorPageTable, (err) => err && handleDatabaseErr('anchor_pages', err));
    this.connection.instance.query(createApiItemTable, (err) => err && handleDatabaseErr('api_items', err));
  }

  endCollection = () => {
    this.connection.instance.end((err) => {
      if (err) {
        return Logger.error('DB close err: ', err.message)
      }
      Logger.info('Server Stopped Successfully.')
    })
  }

}

const db = new DBInitializer();

module.exports = db;