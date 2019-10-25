const { getPartialObj } = require('./obj')

const validateString = str => str && str.trim().length > 0;

const getInvalidRequiredField = (obj) => {
  let invalidKey = ''
  Object.keys(obj).every(key => {
    if (obj[key] === null || obj[key] === undefined) {
      invalidKey = key;
      return false;
    }
    return true;
  })
  return invalidKey;
}

const getInvalidArrRequiredField = (arr, requiredKeys) => {
  let invalidKey = ''
  arr.every(item => {
    const obj = getPartialObj(item, requiredKeys)
    invalidKey = getInvalidRequiredField(obj)
    if (invalidKey) {
      return false
    }
    return true
  })
  return invalidKey;
}


module.exports = {
  validateString,
  getInvalidRequiredField,
  getInvalidArrRequiredField,
}
