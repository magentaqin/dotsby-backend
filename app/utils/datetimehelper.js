const moment = require('moment');

const formatTimestamp = (date = new Date()) => date.getTime()

const formatUTCDatetime = (date = new Date(), hasTimezone = false, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (hasTimezone) {
    return moment.utc(date).format('YYYY-MM-DDTHH:mm:ssZ');
  }
  return moment.utc(date).format(format);
}

module.exports = {
  formatUTCDatetime,
  formatTimestamp,
}
