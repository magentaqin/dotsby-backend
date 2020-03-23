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
    this.connection = this.getConnection()
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
      Logger.error('DB Connection error: ', err.message);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        this.reconnect();
      }
    })
    return connection;
  }

  connectDB = () => {
    return new Promise((resolve, reject) => {
      this.connection.connect((error) => {
        if (error) {
          Logger.error('DB connection error: ', error.message);
          reject(error)
        }

        Logger.info('Successfully connected to db.');
        this.createTables();

        resolve(true)
      });
    })
  }

  reconnect = () => {
    console.log('reconnecting...')
    // recreate new connection
    const connection = this.getConnection()
    connection.connect((error) => {
      if (error) {
        return Logger.error('DB connection error: ', error.message);
      }
      this.connection = connection;
      Logger.info('Successfully connected to db.');
      this.createTables();
    })
  }

  createTables = () => {
    this.connection.query(createUserTable, (err) => err && handleDatabaseErr('users', err));
    this.connection.query(createDocTable, (err) => err && handleDatabaseErr('docs', err));
    this.connection.query(createSectionTable, (err) => err && handleDatabaseErr('sections', err));
    this.connection.query(createPageTable, (err) => err && handleDatabaseErr('pages', err));
    this.connection.query(createAnchorPageTable, (err) => err && handleDatabaseErr('anchor_pages', err));
    this.connection.query(createApiItemTable, (err) => err && handleDatabaseErr('api_items', err));
  }

  endCollection = () => {
    this.dbConnection.end((err) => {
      if (err) {
        Logger.error('DB close err: ', err.message)
        return;
      }
      Logger.info('Server Stopped Successfully.')
    })
  }

}

const db = new DBInitializer();

module.exports = db;