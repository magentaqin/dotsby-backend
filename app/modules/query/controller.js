const responseHelper = require('@app/utils/response')
const { extractErrMsg } = require('@app/utils/extract')
const { Validator } = require('jsonschema')
const {
  GlobalErrorCodes, GlobalErr,
} = require('@app/utils/errorMessages');
const querySchema = require('@schema/src/apis/query_params')

const {
  queryIdOfDoc,
  createTempSections,
  dropTempSections,
  queryText,
} = require('./query')

const validator = new Validator();
const serverErrMsg = GlobalErr[GlobalErrorCodes.SERVER_ERROR];
const authFailMsg = GlobalErr[GlobalErrorCodes.AUTH_FAILED];
const notFoundMsg = GlobalErr[GlobalErrorCodes.NOT_FOUND];

const listQueryResults = async(ctx) => {
  let limit = 5;
  const data = {};
  if (ctx.request.query.limit) {
    limit = Number(ctx.request.query.limit)
    ctx.request.query.limit = limit
  }

  // validate query
  const validationResult = validator.validate(ctx.request.query, querySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  const {
    document_id, version, query_type, search_string,
  } = ctx.request.query;

  // Get id of doc
  const docQueryResp = await queryIdOfDoc(document_id, version).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  if (!docQueryResp.data.length) {
    responseHelper.fail(ctx, GlobalErrorCodes.NOT_FOUND, notFoundMsg, 404);
  }

  const doc = docQueryResp.data[0];

  // TODO. Check Auth.

  // create temp sections table
  await createTempSections(doc.id, doc.updated_at).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  // handle query type "TEXT"
  if (query_type === 'TEXT') {
    const resp = await queryText(search_string, limit).catch(err => {
      if (err.message === GlobalErrorCodes.SERVER_ERROR) {
        responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
      }
    })
    data.query_type = 'TEXT'
    data.items = resp.data.map(matchedItem => {
      const {
        section_id, page_id, paragraph, lv0, lv1, lv2, lv3, lv4, lv5, lv6,
      } = matchedItem;
      const searchRegx = new RegExp(search_string, 'i')
      let slicedContent = '';
      const page_title = lv0 || '';
      let anchor = '';
      const isTitleMatched = lv0 && lv0.search(searchRegx) !== -1
      const isParaMatched = paragraph.search(searchRegx) !== -1
      if (!isTitleMatched) {
        anchor = matchedItem.anchor || lv6 || lv5 || lv4 || lv3 || lv2 || lv1;
        if (isParaMatched) {
          const matchedIndex = paragraph.indexOf(search_string);
          const startIndex = matchedIndex - 100 >= 0 ? matchedIndex - 100 : 0;
          slicedContent = paragraph.slice(startIndex, matchedIndex) + paragraph.slice(matchedIndex, matchedIndex + 100)
        }
      }
      return {
        section_id,
        page_id,
        page_title,
        anchor,
        content: slicedContent,
        search_string,
      }
    })
  }

  // drop temp sections table
  await dropTempSections().catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  responseHelper.success(ctx, data, 200);
}

module.exports = {
  listQueryResults,
}
