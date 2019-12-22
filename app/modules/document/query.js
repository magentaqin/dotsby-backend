const { formatUTCDatetime } = require('@app/utils/datetimehelper');
const dbConnection = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes, GlobalErr, UserErrorCodes, UserErr } = require('@app/utils/errorMessages');

const createDocQuery = (data) => {
  const { document_id, version, title, user_id } = data;
  const now = formatUTCDatetime();
  const sql = `INSERT INTO docs(document_id,version,title,created_at,updated_at,user_id)
               VALUES(?,?,?,?,?,?)`;
  const doc = [document_id, version, title, now, now, user_id];
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

module.exports = {
  createDocQuery,
}