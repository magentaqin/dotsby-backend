const responseHelper = require('@app/utils/response')
const { extractErrMsg } = require('@app/utils/extract')
const { queryDocAuth, queryUserById } = require('@app/modules/document/query');
const { Validator } = require('jsonschema')
const {
  GlobalErrorCodes, GlobalErr,
} = require('@app/utils/errorMessages');
const querySchema = require('@schema/src/apis/query_params')

const validator = new Validator()

const listQueryResults = async(ctx) => {
  let limit = 5;
  if (ctx.request.query.limit) {
    limit = Number(ctx.request.query.limit)
    ctx.request.query.limit = limit
  }

  // validate query
  const validationResult = validator.validate(ctx.request.query, querySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  const { document_id, query_type, search_string } = ctx.request.query;

  // TODO. Check Auth.

  // handle query type "TEXT"
  if (query_type === 'TEXT') {

  }
  responseHelper.success(ctx, [], 200);
}

module.exports = {
  listQueryResults,
}
