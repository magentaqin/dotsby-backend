const axios = require('axios')
const config = require('config')

const client = axios.create({
  baseURL: `http://localhost:${config.port}`,
  headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
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

  try {
    const resp = await client.request(options)
    return resp
  } catch(err) {
    const { status, data } = err.response;
    return {
      status,
      data
    }
  }
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