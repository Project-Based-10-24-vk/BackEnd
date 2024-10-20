const { countriesAPI } = require('../configs/config')
const { apiHeadersKey } = require('../consts/location')
const axiosService = require('../utils/axiosService')

const locationService = {
  getCountries: async () => {
    const url = countriesAPI.url
    const customHeaders = {
      [apiHeadersKey.COUNTRIES]: countriesAPI.apiKey
    }

    const response = await axiosService.get(url, customHeaders)

    return response.map((country) => {
      const { id, name, iso2 } = country
      return { id, name, iso2 }
    })
  },

  getCities: async (countryCode) => {
    const customHeaders = {
      [apiHeadersKey.COUNTRIES]: countriesAPI.apiKey
    }
    const url = `${countriesAPI.url}/${countryCode}/cities`

    return await axiosService.get(url, customHeaders)
  }
}

module.exports = locationService
