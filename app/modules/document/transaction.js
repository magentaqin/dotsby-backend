/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const hashHelper = require('object-hash');
const { formatUTCDatetime } = require('@app/utils/datetimehelper');
const { formatApiItems } = require('@app/utils/apiItem');
const db = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { GlobalErrorCodes } = require('@app/utils/errorMessages');
const { transformToHTML } = require('@app/utils/transform');
const { formatTitle, pairParagraphWithAnchor } = require('@app/utils/extract')

const { connection } = db;

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

const insertSectionsQuery = (sections) => {
  const sectionsInsertSql = 'INSERT INTO sections(section_id,title,order_index,page_info,created_at,updated_at,doc_id) VALUES ? ';
  return new Promise((resolve, reject) => {
    connection.query(sectionsInsertSql, [sections], (error, results) => {
      if (error) {
        Logger.error('insert sections err: ', error, sections);
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const insertPagesQuery = (pages) => {
  const sql = 'INSERT INTO pages(page_id,title,is_root_path,path, content, api_content, request_url, created_at,updated_at,section_id) VALUES ? ';
  return new Promise((resolve, reject) => {
    connection.query(sql, [pages], (error, results) => {
      if (error) {
        Logger.error('insert pages err: ', error, pages);
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  });
}

const insertAnchorPageQuery = (info) => {
  const sql = `INSERT INTO anchor_pages(lv0, lv1, lv2, lv3, lv4, lv5, lv6,
    anchor, paragraph, created_at, updated_at, page_id, section_id) VALUES ?`;
  return new Promise((resolve, reject) => {
    connection.query(sql, [info], (error, results) => {
      if (error) {
        Logger.error('insert anchor_pages err: ', error, info);
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  });
}

const insertApiItemsQuery = (apiItems) => {
  const sql = 'INSERT INTO api_items(displayName, description, category, created_at, updated_at, page_id) VALUES ? ';
  return new Promise((resolve, reject) => {
    connection.query(sql, [apiItems], (error, results) => {
      if (error) {
        Logger.error('insert api items err: ', error, apiItems);
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const getAnchorPairs = (htmlContent, now, page_id, section_id) => pairParagraphWithAnchor(htmlContent).map(item => {
  const {
    lv0, lv1, lv2, lv3, lv4, lv5, lv6, anchor, paragraph,
  } = item;
  return [
    lv0,
    lv1,
    lv2,
    lv3,
    lv4,
    lv5,
    lv6,
    anchor,
    paragraph,
    now,
    now,
    page_id,
    section_id,
  ]
})


const publishTransaction = (docData, sectionData, isNewVersion) => {
  /**
   * config doc data
   */
  const {
    document_id, version, title, user_id, email, id_of_doc,
  } = docData;
  const now = formatUTCDatetime();
  const insertedDoc = [document_id, version, title, true, now, now, user_id, email];
  const updatedDoc = [title, now, true, id_of_doc];

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
       * 2) if the version existed already: update title in docs and insert rows in sections/pages/api_items table.
       *
       */
      if (isNewVersion) {
        const resp = await insertNewDocQuery(insertedDoc, document_id, user_id).catch(() => {
          connection.rollback();
        });
        if (resp) {
          fkDocId = resp.data.insertId;
        } else {
          return reject(new Error(GlobalErrorCodes.SERVER_ERROR))
        }
      } else {
        const resp = await updateDocQuery(updatedDoc, document_id, user_id).catch(() => {
          connection.rollback();
        })
        if (resp) {
          fkDocId = id_of_doc;
        } else {
          return reject(new Error(GlobalErrorCodes.SERVER_ERROR))
        }
      }

      /**
      * config page data and section data
      */
      const pages = [];
      const sections = [];
      let apiItems = [];
      let anchorPairs = [];
      for (let i = 0; i < sectionData.length; i++) {
        const item = sectionData[i];
        const sectionId = hashHelper({ section_title: item.title, order_index: i, created_at: now });
        const basicPageInfo = [];

        for (let j = 0; j < item.pages.length; j++) {
          const pageItem = item.pages[j];
          const pageId = hashHelper({ page_title: pageItem.title, path: pageItem.path, created_at: now });
          const pageObj = {
            title: pageItem.title,
            is_root_path: !!pageItem.is_root_path,
            path: pageItem.path,
            page_id: pageId,
          }
          const { apiContent, content, request_url } = pageItem
          let pageContent = '';
          if (content) {
            const htmlContent = await transformToHTML(content).catch(err => {
              console.log('fail to transform markdown to html: ', err);
              connection.rollback();
            })
            if (!htmlContent) {
              return reject(new Error(GlobalErrorCodes.SERVER_ERROR));
            }
            try {
              pageContent = formatTitle(htmlContent);
              anchorPairs = anchorPairs.concat(getAnchorPairs(htmlContent, now, pageId, sectionId));
            } catch (err) {
              console.log('fail to format html content title or pair anchor: ', err);
              connection.rollback();
              return reject(new Error(GlobalErrorCodes.SERVER_ERROR));
            }
          }
          const api_content = apiContent ? JSON.stringify(apiContent) : '';
          const requestUrl = apiContent ? request_url : null;
          pages.push([
            pageId,
            pageItem.title,
            !!pageItem.is_root_path,
            pageItem.path,
            pageContent,
            api_content,
            requestUrl,
            now,
            now,
            sectionId,
          ])
          if (apiContent) {
            try {
              anchorPairs.push(getAnchorPairs(`<h1>${pageItem.title}</h1>`, now, pageId, sectionId)[0])
            } catch (err) {
              console.log('fail to pair api content anchor: ', err)
              connection.rollback();
              return reject(new Error(GlobalErrorCodes.SERVER_ERROR))
            }
            const {
              request_headers, query_params, body, responses,
            } = apiContent;
            const requestHeaderItems = formatApiItems({ data: request_headers, category: 'REQUEST_HEADERS' }, pageId);
            const queryParamsItems = formatApiItems({ data: query_params, category: 'QUERY_PARAMS' }, pageId);
            const requestBodyItems = formatApiItems({ data: body, category: 'REQUEST_BODY' }, pageId);
            apiItems = apiItems.concat(requestHeaderItems, queryParamsItems, requestBodyItems);
            responses.forEach(response => {
              const responseHeaders = formatApiItems({ data: response.headers, category: 'RESPONSE_HEADERS' }, pageId);
              const responseData = formatApiItems({ data: response.data, category: 'RESPONSE_DATA' }, pageId);
              apiItems = apiItems.concat(responseHeaders, responseData);
            })
          }
          basicPageInfo.push(pageObj);
        }

        sections.push([
          sectionId,
          item.title,
          i,
          JSON.stringify(basicPageInfo),
          now,
          now,
          fkDocId,
        ]);
      }


      // insert rows to sections table
      const sectionInsertResp = await insertSectionsQuery(sections).catch(() => {
        connection.rollback();
      })
      if (!sectionInsertResp) {
        return reject(new Error(GlobalErrorCodes.SERVER_ERROR));
      }


      // insert rows to pages table
      const pageInsertResp = await insertPagesQuery(pages).catch(() => {
        connection.rollback();
      })
      if (!pageInsertResp) {
        return reject(new Error(GlobalErrorCodes.SERVER_ERROR));
      }

      // insert rows to anchor_pages table
      const anchorInsertResp = await insertAnchorPageQuery(anchorPairs).catch(() => {
        connection.rollback();
      })
      if (!anchorInsertResp) {
        return reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }

      // insert rows to api_items table
      if (apiItems.length) {
        const apiItemInsertResp = await insertApiItemsQuery(apiItems).catch(() => {
          connection.rollback();
        })
        if (!apiItemInsertResp) {
          return reject(new Error(GlobalErrorCodes.SERVER_ERROR))
        }
      }

      connection.commit((commitErr) => {
        if (commitErr) {
          return reject(new Error(GlobalErrorCodes.SERVER_ERROR))
        }
        Logger.info('publish new doc transaction committed!')
        resolve({ document_id, version })
      })
    })
  })
}

module.exports = {
  publishTransaction,
}
