const axios = require('axios')
const config = require('config')

const client = axios.create({
  baseURL: `http://localhost:${config.port}`,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  withCredentials: true,
  responseType: 'json',
  timeout: 20000,
})

const request = async(url, method, data, headerData = {}) => {
  const headers = { ...headerData }
  const options = {
    url,
    method,
    data,
    headers
  }

  const resp = await client.request(options).catch(err => console.error(err))
  return resp;
}

const http = {
  get: (url, data, headerData = {}) => {
    return request(url, 'GET', data, headerData)
  },
  post: (url, data, headerData = {}) => {
    return request(url, 'POST', data, headerData)
  },
}

module.exports = http