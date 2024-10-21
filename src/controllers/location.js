const locationService = require('~/services/location')

const getCountries = async (req, res) => {
  const countries = await locationService.getCountries()

  res.status(200).json(countries)
}
// Begin of changing for this PR
const getCities = async (req, res) => {
  const countryCode = req.params.countryCode

  const cities = await locationService.getCities(countryCode)

  res.status(200).json(cities)
}
// End of changing for this PR
module.exports = {
  getCountries,
  getCities
}
