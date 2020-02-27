const mysql = require('mysql');
const config = require('config');

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

module.exports = connection;
