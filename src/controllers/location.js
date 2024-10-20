const locationService = require('~/services/location')

const getCountries = async (req, res) => {
  const countries = await locationService.getCountries()

  res.status(200).json(countries)
}

const getCities = async (req, res) => {
  const countryCode = req.params.countryCode

  const cities = await locationService.getCities(countryCode)

  res.status(200).json(cities)
}

module.exports = {
  getCountries,
  getCities
}
