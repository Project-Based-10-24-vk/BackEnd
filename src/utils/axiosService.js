const { default: axios } = require('axios')

const axiosService = {
  get: async (url, customHeaders = {}) => {
    const response = await axios({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders
      },
      timeout: 10000
    })

    return response.data
  }
}

module.exports = axiosService
