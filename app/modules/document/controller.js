const { Validator } = require('jsonschema')
const hashHelper = require('object-hash');

const createDocumentQuerySchema = require('@schema/src/apis/document_create_params');
const publishDocumentQuerySchema = require('@schema/src/apis/document_publish_params');
const getDocumentInfoQuerySchema = require('@schema/src/apis/document_info_params');
const {
  GlobalErrorCodes, GlobalErr, DocErrorCodes, DocErr,
} = require('@app/utils/errorMessages');
const { extractErrMsg } = require('@app/utils/extract');
const { compareVersion } = require('@app/utils/compare');
const { sampleDocumentInfo } = require('@test/sampleData')
const { queryUserById } = require('@app/modules/user/query');
const responseHelper = require('@app/utils/response');
const { formatUTCDatetime } = require('@app/utils/datetimehelper');
const { omitKeys } = require('@app/utils/obj');
const {
  createDocQuery, queryDocByDocId, queryDocsbyUserId, queryDocbyVersion, querySectionsByDocId,
} = require('./query');
const { publishTransaction } = require('./transaction');

const validator = new Validator();
const serverErrMsg = GlobalErr[GlobalErrorCodes.SERVER_ERROR];
const authFailMsg = GlobalErr[GlobalErrorCodes.AUTH_FAILED];


const createDocument = async(ctx) => {
  if (!ctx.isTokenValid) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }
  const { userId, email } = ctx.tokenPayload;
  const queryResp = await queryUserById(userId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const userInfo = queryResp.data[0];
  if (userInfo.email !== email) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }

  const validationResult = validator.validate(ctx.request.body, createDocumentQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  const { version, title } = ctx.request.body;

  // hash document_id. document_id is used to identify the document.
  const document_id = hashHelper({ email, document_created_at: Date.now() })

  await createDocQuery({
    document_id, version, title, user_id: userInfo.id, email,
  }).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  responseHelper.success(ctx, { document_id, version }, 200);
}

/**
 * Publish Document
 */
const publishDocument = async(ctx) => {
  if (!ctx.isTokenValid) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }
  const { userId, email } = ctx.tokenPayload;
  const queryResp = await queryUserById(userId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const userInfo = queryResp.data[0];
  if (userInfo.email !== email) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }

  // schema validation
  const validationResult = validator.validate(ctx.request.body, publishDocumentQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  // document_id validation
  const docQueryResp = await queryDocByDocId(ctx.request.body.document_id).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  // should create document before publishing
  if (!docQueryResp.data.length || docQueryResp.data[0].email !== userInfo.email) {
    const errorCode = DocErrorCodes.CREATE_BEFORE_PUBLISH;
    responseHelper.fail(ctx, errorCode, DocErr[errorCode], 403);
  }

  const { version, title, sections } = ctx.request.body;

  // publishment of initial version can not be skipped
  if (docQueryResp.data.length === 1) {
    const initialDoc = docQueryResp.data[0];
    if (!initialDoc.is_published && initialDoc.version !== version) {
      const errorCode = DocErrorCodes.INITIAL_VERSION_MUST_PUBLISH;
      responseHelper.fail(ctx, errorCode, DocErr[errorCode], 403);
    }
  }

  // check if version existed
  let matchedDoc;
  const isVersionExisted = docQueryResp.data.some(item => {
    if (item.version === version) {
      matchedDoc = item;
      return true;
    }
    return false;
  });

  const docData = {
    version,
    title,
    user_id: userId,
    email,
    document_id: ctx.request.body.document_id,
  }
  let resp = {};
  if (isVersionExisted) {
    docData.id_of_doc = matchedDoc.id;
    // publish the first version of doc or update already published version. NEED OPTIMIZE. TODO!
    resp = await publishTransaction(docData, sections, false).catch(err => {
      if (err.message === GlobalErrorCodes.SERVER_ERROR) {
        responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
      }
    })
  } else {
    // publish new version of doc
    resp = await publishTransaction(docData, sections, true).catch(err => {
      if (err.message === GlobalErrorCodes.SERVER_ERROR) {
        responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
      }
    })
  }

  const data = {
    document_id: resp.document_id,
    version: resp.version,
  }

  responseHelper.success(ctx, data, 200)
}

const listDocument = async(ctx) => {
  if (!ctx.isTokenValid) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }
  const { userId, email } = ctx.tokenPayload;
  const queryResp = await queryUserById(userId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const userInfo = queryResp.data[0];
  if (userInfo.email !== email) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }

  const docsListQueryResp = await queryDocsbyUserId(userInfo.id).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const docslistMap = {};
  docsListQueryResp.data.forEach(item => {
    const key = item.document_id;
    const formattedItem = {
      ...item,
      is_published: !!item.is_published,
      created_at: formatUTCDatetime(item.creaed_at, true),
      updated_at: formatUTCDatetime(item.updated_at, true),
    }
    if (!docslistMap[key]) {
      docslistMap[key] = {
        ...formattedItem,
        all_versions: [item.version],
      }
    } else {
      const prevDoc = docslistMap[key]
      prevDoc.all_versions.push(item.version);
      if (compareVersion(prevDoc.version, item.version) === -1) {
        docslistMap[key] = {
          ...formattedItem,
          all_versions: prevDoc.all_versions,
        }
      }
    }
  })


  const data = Object.values(docslistMap);

  responseHelper.success(ctx, data, 200)
}

const getDocumentInfo = async(ctx) => {
  // check auth
  if (!ctx.isTokenValid) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }
  const { userId, email } = ctx.tokenPayload;
  const userQueryResp = await queryUserById(userId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const userInfo = userQueryResp.data[0];
  if (userInfo.email !== email) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }

  // validate query
  const validationResult = validator.validate(ctx.request.query, getDocumentInfoQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  // query doc by document_id and version
  const { document_id, version } = ctx.request.query;
  const docQueryResp = await queryDocbyVersion(document_id, version).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const docData = docQueryResp.data[0]
  const docUpdatedAt = docData.updated_at;
  const id_of_doc = docData.id;
  const sectionQueryResp = await querySectionsByDocId(id_of_doc, docUpdatedAt).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  const sectionsData = [];
  sectionQueryResp.data.forEach(item => {
    const section = {
      section_id: item.section_id,
      title: item.section_id,
      created_at: formatUTCDatetime(item.created_at, true),
      updated_at: formatUTCDatetime(item.updated_at, true),
      pages: JSON.parse(item.page_info),
    }
    sectionsData[item.order_index] = section;
  })
  docData.created_at = formatUTCDatetime(docData.created_at, true);
  docData.updated_at = formatUTCDatetime(docData.updated_at, true);
  docData.sections = sectionsData;

  const data = omitKeys(docData, ['id']);

  responseHelper.success(ctx, data, 200)
}

module.exports = {
  createDocument,
  publishDocument,
  getDocumentInfo,
  listDocument,
}
