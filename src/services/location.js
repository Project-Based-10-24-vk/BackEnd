const { countriesAPI } = require('../configs/config')
const { apiHeadersKey } = require('../consts/location')
const axiosService = require('../utils/axiosService')

const locationService = {
  getCountries: async () => {
    const url = countriesAPI.url
    const customHeaders = {
      [apiHeadersKey.COUNTRIES]: countriesAPI.apiKey
    }

    return await axiosService.get(url, customHeaders)
  }
}

module.exports = locationService
