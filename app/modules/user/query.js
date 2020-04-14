const mysql = require('mysql');
const db = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');

const queryUserById = (id) => {
  const sql = `SELECT * FROM users WHERE id = ${mysql.escape(id)}` ;
  return new Promise((resolve, reject) => {
    db.connection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('query user by id error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

module.exports = {
  queryUserById,
}