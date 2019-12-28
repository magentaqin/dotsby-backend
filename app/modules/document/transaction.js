const mysql = require('mysql');
const hashHelper = require('object-hash');
const { formatUTCDatetime } = require('@app/utils/datetimehelper');
const connection = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');

const insertNewDocQuery = (insertedDoc, document_id, user_id) => {
  const docInsertSql = `INSERT INTO docs(document_id,version,title,is_published,created_at,updated_at,user_id,email)
                        VALUES(?,?,?,?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    connection.query(docInsertSql, insertedDoc, (error, results) => {
      if (error) {
        Logger.error('insert new doc err: ', error, document_id, user_id)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results });
    })
  })
}

const updateDocQuery = (updatedDoc, document_id, user_id) => {
  const docUpdateSql = 'UPDATE docs SET title = ?, updated_at = ?, is_published = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    connection.query(docUpdateSql, updatedDoc, (error, results) => {
      if (error) {
        Logger.error('update doc err: ', error, document_id, user_id)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results });
    })
  })
}

const publishNewDoc = (docData, sectionData, isNewVersion) => {
  /**
   * config doc data
   */
  const {
    document_id, version, title, user_id, email,
  } = docData;
  const now = formatUTCDatetime();
  const insertedDoc = [document_id, version, title, true, now, now, user_id, email];
  const updatedDoc = [title, now, true, docData.id];

  return new Promise((resolve, reject) => {
    connection.beginTransaction(async (err) => {
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
        const resp = await insertNewDocQuery(insertedDoc, document_id, user_id).catch(() => {
          connection.rollback(() => {
            reject(new Error(GlobalErrorCodes.SERVER_ERROR))
          })
        });
        if (resp) {
          fkDocId = resp.data.results.insertId;
        }
      } else {
        const resp = await updateDocQuery(updatedDoc, document_id, user_id).catch(() => {
          connection.rollback(() => {
            reject(new Error(GlobalErrorCodes.SERVER_ERROR));
          })
        })
        if (resp) {
          fkDocId = resp.data.results.insertId;
        }
      }

      /**
      * config page data and section data
      */
      const pages = [];
      const sections = [];
      sectionData.forEach((item, index) => {
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

        sections.push([
          sectionId,
          item.title,
          index,
          JSON.stringify(pageInfo),
          now,
          now,
          fkDocId,
        ]);
      })


      // insert rows to sections table
      const sectionsInsertSql = `INSERT INTO sections(section_id,title,order_index,page_info,created_at,updated_at,doc_id) VALUES ? `;
      connection.query(sectionsInsertSql, [sections], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            Logger.error('insert sections err: ', error, fkDocId, JSON.stringify(sections))
            reject(new Error(GlobalErrorCodes.SERVER_ERROR))
          })
        }
      });


      // insert rows to pages table
    })
  })
}

const updatePublish = () => {

}

module.exports = {
  publishNewDoc,
  updatePublish,
}