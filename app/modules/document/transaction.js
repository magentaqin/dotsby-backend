const mysql = require('mysql');
const hashHelper = require('object-hash');
const { formatUTCDatetime } = require('@app/utils/datetimehelper');
const connection = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');

const publishNewDoc = (docData, sectionData, isNewVersion) => {
  /**
   * config doc data
   */
  const {
    document_id, version, title, user_id, email,
  } = docData;
  const now = formatUTCDatetime();
  const docInsertSql = `INSERT INTO docs(document_id,version,title,is_published,created_at,updated_at,user_id,email)
               VALUES(?,?,?,?,?,?,?,?)`;
  const insertedDoc = [document_id, version, title, true, now, now, user_id, email];
  const docUpdateSql = 'UPDATE docs SET title = ?, updated_at = ?, is_published = ? WHERE id = ?';
  const updatedDoc = [title, now, true, docData.id];

  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        Logger.error('publish new doc transaction err: ', err)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }

      let fkDocId = '';

      /**
       * 1) if the version is new:insert rows in docs/sections/pages/api_items table.
       *
       * 2) if the version existed already && it has not been published:update title in docs and insert rows in sections/pages/api_items table.
       */
      if (isNewVersion) {
        connection.query(docInsertSql, insertedDoc, (error, results) => {
          if (error) {
            return connection.rollback(() => {
              Logger.error('insert new doc err: ', error, document_id, user_id)
              reject(new Error(GlobalErrorCodes.SERVER_ERROR))
            })
          }
          fkDocId = results.insertId;
        })
      } else {
        connection.query(docUpdateSql, updatedDoc, (error, results) => {
          if (error) {
            return connection.rollback(() => {
              Logger.error('update err: ', error, document_id, user_id)
              reject(new Error(GlobalErrorCodes.SERVER_ERROR))
            })
          }
          fkDocId = results.insertId;
        })
      }

      /**
      * config page data and section data
      */
      const pages = [];
      const sections = sectionData.map((item, index) => {
        const sectionId = hashHelper({ section_title: item.title, order_index: index, created_at: now });

        const pageInfo = item.pages.map(pageItem => {
          const pageId = hashHelper({ page_title: pageItem.title, path: pageItem.path, created_at: now });
          const pageObj = {
            title: pageItem.title,
            is_root_path: pageItem.is_root_path,
            path: pageItem.path,
            page_id: pageId,
          }

          const { apiContent, content, request_url } = pageItem
          const subtitles = []; // TODO.EXTRACT SUBTITLES FROM HTML
          pages.push({
            ...pageObj,
            content: content ? JSON.stringify(content) : '',
            api_content: apiContent ? JSON.stringify(apiContent) : '',
            request_url: apiContent ? request_url : null,
            subtitles: content ? JSON.stringify(subtitles) : null,
            section_id: sectionId,
          })

          return pageObj;
        })

        return {
          title: item.title,
          order_index: index,
          section_id: sectionId,
          doc_id: fkDocId,
          created_at: now,
          updated_at: now,
          page_info: JSON.stringify(pageInfo),
        }
      })


      // insert new row to sections and pages table
    })
  })
}

const updatePublish = () => {

}
