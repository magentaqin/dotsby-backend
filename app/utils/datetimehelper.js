const formatUTCDatetime = (date = new Date()) => {
  return date.toUTCString()
}

const formatTimestamp = (date = new Date()) => {
  return date.getTime()
}

module.exports = {
  formatUTCDatetime,
  formatTimestamp,
}