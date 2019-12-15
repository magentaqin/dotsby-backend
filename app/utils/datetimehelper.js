const moment = require('moment');

const formatTimestamp = (date = new Date()) => date.getTime()

const formatUTCDatetime = (date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment.utc(date).format(format);
}

module.exports = {
  formatUTCDatetime,
  formatTimestamp,
}
