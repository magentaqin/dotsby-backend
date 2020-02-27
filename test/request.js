const axios = require('axios')
const config = require('config')
const qs = require('qs')
const { GlobalErrorCodes, GlobalErr } = require('@app/utils/errorMessages')

const client = axios.create({
  baseURL: `http://${config.host}:${config.port}`,
  headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
  responseType: 'json',
  timeout: 20000,
})

const request = async(url, method, data, headerData = {}) => {
  const headers = { ...headerData }

  const options = {
    url,
    method,
    headers,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  }

  if (method === 'GET') {
    options.params = data;
  } else {
    options.data = data;
  }

  try {
    const resp = await client.request(options)
    return resp
  } catch (err) {
    if (err.response) {
      return {
        status: err.response.status,
        data: err.response.data,
      }
    }
    return {
      status: 500,
      data: {
        code: GlobalErrorCodes.SERVER_ERROR,
        msg: GlobalErr[GlobalErrorCodes.SERVER_ERROR],
      },
    }
  }
}


const http = {
  get: (url, data, headerData = {}) => request(url, 'GET', data, headerData),
  post: (url, data, headerData = {}) => request(url, 'POST', data, headerData),
}

module.exports = http
