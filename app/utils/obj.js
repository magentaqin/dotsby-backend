const getPartialObj = (obj, partialKeys) => {
  const partialObj = {}
  partialKeys.forEach(key => {
    partialObj[key] = obj[key]
  })
  return partialObj;
}

const omitKeys = (obj, keysToOmit) => {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (!keysToOmit.includes(key)) {
      newObj[key] = obj[key]
    }
  })
  return newObj;
}

module.exports = {
  getPartialObj,
  omitKeys,
}
