const mysql = require('mysql');
const dbConnection = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');

const queryIdOfDoc = (document_id, version) => {
  const sql = `SELECT id, updated_at FROM docs
    WHERE document_id = ${mysql.escape(document_id)}
    AND version = ${mysql.escape(version)}
    AND is_published = true`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query id of doc error: ', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const createTempSections = (fkDocId, updated_at) => {
  const sql = `CREATE TEMPORARY TABLE temp_sections
    SELECT section_id FROM sections
    WHERE doc_id = ${mysql.escape(fkDocId)}
    AND created_at = ${mysql.escape(updated_at)}`;

  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('create temp sections error: ', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const dropTempSections = () => {
  const sql = 'DROP TEMPORARY TABLE temp_sections';
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('drop temp sections error: ', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryText = (search_string, limit) => {
  const sql = `SELECT page_id, title, content
    FROM pages
    WHERE section_id IN (SELECT * FROM temp_sections)
    AND (title LIKE ${mysql.escape(`%${search_string}%`)}
    OR content LIKE ${mysql.escape(`%${search_string}%`)}) LIMIT ${mysql.escape(limit)}`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query text error: ', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

module.exports = {
  queryText,
  queryIdOfDoc,
  createTempSections,
  dropTempSections,
}
