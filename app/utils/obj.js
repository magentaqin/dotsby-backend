const getPartialObj = (obj, partialKeys) => {
  const partialObj = {}
  partialKeys.forEach(key => {
    partialObj[key] = obj[key]
  })
  return partialObj;
}

module.exports = {
  getPartialObj,
}
