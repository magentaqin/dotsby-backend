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

const connection = mysql.createConnection({
  host,
  user,
  password,
  database,
  port,
});

const handleDatabaseErr = (tableName, err) => {
  Logger.error(`Fail to create ${tableName} table`, err.message);
}

const createTables = () => {
  connection.query(createUserTable, (err) => err && handleDatabaseErr('users', err));
  connection.query(createDocTable, (err) => err && handleDatabaseErr('docs', err));
  connection.query(createSectionTable, (err) => err && handleDatabaseErr('sections', err));
  connection.query(createPageTable, (err) => err && handleDatabaseErr('pages', err));
  connection.query(createAnchorPageTable, (err) => err && handleDatabaseErr('anchor_pages', err));
  connection.query(createApiItemTable, (err) => err && handleDatabaseErr('api_items', err));
}

const reconnect = () => {
  console.log('reconnecting...')
  connection.connect((error) => {
    if (error) {
      Logger.error('DB connection error: ', error.message);
    }
    Logger.info('Successfully connected to db.');
    createTables();
  })
}

const connectDB = () => {
  return new Promise((resolve, reject) => {
    connection.connect((error) => {
      if (error) {
        Logger.error('DB connection error: ', error.message);
        reject(error)
      }

      Logger.info('Successfully connected to db.');
      createTables();

      resolve(true)
    });
  })
}

connection.on('error', (err) => {
  Logger.error('DB Connection error: ', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    reconnect();
  }
})

module.exports = {
  dbConnection: connection,
  connectDB,
  reconnect,
}