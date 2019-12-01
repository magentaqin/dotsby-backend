const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qm123456',
  database: 'dotsby'
});

module.exports = connection;
