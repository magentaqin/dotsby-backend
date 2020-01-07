const { formatUTCDatetime } = require('@app/utils/datetimehelper');

const parseType = (type, result, category, page_id) => {
  try {
    const item = JSON.parse(type);
    const now = formatUTCDatetime();
    if (item.type === 'object') {
      Object.keys(item.properties).forEach(prop => {
        result.push([prop, item.properties[prop].description, category, now, now, page_id])
      })
    }
  // eslint-disable-next-line no-empty
  } catch (err) {

  }
}

const formatApiItems = (itemsToFormat, page_id) => {
  const { data, category } = itemsToFormat;
  const now = formatUTCDatetime();
  const result = [];
  data.forEach(item => {
    result.push([item.displayName, item.description, category, now, now, page_id])
    if (Array.isArray(item.properties)) {
      item.properties.forEach(prop => {
        result.push([prop.displayName, prop.description, category, now, now, page_id])
        parseType(prop.type, result, category, page_id);
      })
    }
  })
  return result;
}

module.exports = {
  formatApiItems,
}