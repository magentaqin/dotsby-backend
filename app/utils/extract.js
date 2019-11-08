const extractErrMsg = (validationResult) => {
  const error = validationResult.errors[0]
  const { message, property } = error
  const errMsg = property + message;
  return errMsg;
}

module.exports = {
  extractErrMsg,
}