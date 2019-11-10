const extractErrMsg = (validationResult) => {
  let errMsg = 'Please pass at least one parameter.';
  const error = validationResult.errors[0]

  if (error) {
    const { message, property } = error
    errMsg = `${property} ${message}`
  }
  return errMsg;
}

module.exports = {
  extractErrMsg,
}
