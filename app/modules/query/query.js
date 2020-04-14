const mysql = require('mysql');
const db = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');

const dbConnection = db.connection;

const queryIdOfDoc = (document_id, version) => {
  const sql = `SELECT id, updated_at FROM docs
    WHERE document_id = ${mysql.escape(document_id)}
    AND version = ${mysql.escape(version)}
    AND is_published = true`;
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, (error, results) => {
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
    dbConnection.instance.query(sql, (error, results) => {
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
    dbConnection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('drop temp sections error: ', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryText = (search_string, limit) => {
  const sql = `SELECT lv0, lv1, lv2, lv3, lv4, lv5, lv6, anchor, paragraph, page_id, section_id
    FROM anchor_pages
    WHERE section_id IN (SELECT * FROM temp_sections)
    AND (lv0 LIKE ${mysql.escape(`%${search_string}%`)}
    OR lv1 LIKE ${mysql.escape(`%${search_string}%`)}
    OR lv2 LIKE ${mysql.escape(`%${search_string}%`)}
    OR lv3 LIKE ${mysql.escape(`%${search_string}%`)}
    OR lv4 LIKE ${mysql.escape(`%${search_string}%`)}
    OR lv5 LIKE ${mysql.escape(`%${search_string}%`)}
    OR lv6 LIKE ${mysql.escape(`%${search_string}%`)}
    OR paragraph LIKE ${mysql.escape(`%${search_string}%`)}
    OR anchor LIKE ${mysql.escape(`%${search_string}%`)}
    )
    ORDER BY anchor ASC
    LIMIT ${mysql.escape(limit)}`;
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('query text error: ', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const querySectionTitle = (section_id) => {
  const sql = `SELECT title from sections WHERE section_id=${mysql.escape(section_id)}`
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('query section title error: ', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryPageTitle = (page_id) => {
  const sql = `SELECT title from pages WHERE page_id=${mysql.escape(page_id)}`;
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('query page title error: ', error)
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
  querySectionTitle,
  queryPageTitle,
}
