const mysql = require('mysql');
const { formatUTCDatetime } = require('@app/utils/datetimehelper');
const db = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');

const dbConnection = db.connection;

const createDocQuery = (data) => {
  const { document_id, version, title, user_id, email } = data;
  const now = formatUTCDatetime();
  const sql = `INSERT INTO docs(document_id,version,title,created_at,updated_at,user_id,email)
               VALUES(?,?,?,?,?,?,?)`;
  const doc = [document_id, version, title, now, now, user_id, email];
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, doc, (error, results) => {
      if (error) {
        Logger.error('insert new doc err: ', error, document_id, user_id)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryDocByDocId = (document_id) => {
  const sql = `SELECT * FROM docs WHERE document_id = ${mysql.escape(document_id)}`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query docs by document_id error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryDocsbyUserId = (user_id) => {
  const sql = `SELECT document_id, version, title, is_published, created_at, updated_at FROM docs WHERE user_id = ${mysql.escape(user_id)} ORDER BY created_at DESC`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query docs by user_id error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryDocbyVersion = (document_id, version) => {
  const sql = `SELECT id, document_id, version, title, created_at, updated_at FROM docs WHERE document_id = ${mysql.escape(document_id)} AND version = ${mysql.escape(version)} AND is_published = true`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query docs by version error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const querySectionsByDocId = (fkDocId, updated_at) => {
  const sql = `SELECT * FROM sections WHERE doc_id = ${mysql.escape(fkDocId)} AND created_at = ${mysql.escape(updated_at)}`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query sections by foreign key doc_id error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryDocAuth = (document_id) => {
  const sql = `SELECT DISTINCT is_private FROM docs WHERE document_id = ${mysql.escape(document_id)}`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('query doc auth by document_id error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

module.exports = {
  createDocQuery,
  queryDocByDocId,
  queryDocsbyUserId,
  queryDocbyVersion,
  querySectionsByDocId,
  queryDocAuth,
}
