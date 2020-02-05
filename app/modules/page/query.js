const mysql = require('mysql');
const dbConnection = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');

const queryPageById = (page_id) => {
  const sql = `SELECT page_id, title, is_root_path, path, content, api_content, created_at, updated_at FROM pages WHERE page_id = ${mysql.escape(page_id)}`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query page by page_id error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

module.exports = {
  queryPageById,
}