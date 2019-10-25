const formatUTCDatetime = (date = new Date()) => date.toUTCString()

const formatTimestamp = (date = new Date()) => date.getTime()

module.exports = {
  formatUTCDatetime,
  formatTimestamp,
}
