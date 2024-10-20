const { countriesAPI } = require('~/configs/config')
const { apiHeadersKey } = require('~/consts/location')
const locationService = require('~/services/location')
const axiosService = require('~/utils/axiosService')

jest.mock('~/utils/axiosService')

describe('locationService.getCountries', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of countries with id, name, and iso2', async () => {
    const mockedResponse = [
      { id: 1, name: 'Country A', iso2: 'CA' },
      { id: 2, name: 'Country B', iso2: 'CB' }
    ]
    axiosService.get.mockResolvedValue(mockedResponse)

    const result = await locationService.getCountries()

    expect(result).toEqual([
      { id: 1, name: 'Country A', iso2: 'CA' },
      { id: 2, name: 'Country B', iso2: 'CB' }
    ])
    expect(axiosService.get).toHaveBeenCalledTimes(1)
  })

  it('should handle errors when API request fails', async () => {
    axiosService.get.mockRejectedValue(new Error('API Error'))

    await expect(locationService.getCountries()).rejects.toThrow('API Error')

    expect(axiosService.get).toHaveBeenCalledTimes(1)
  })
})

describe('locationService.getCities', () => {
  const countryCode = 'CA'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of cities for the given country code', async () => {
    const mockedResponse = [
      { id: 101, name: 'Toronto' },
      { id: 102, name: 'Vancouver' }
    ]
    axiosService.get.mockResolvedValue(mockedResponse)

    const result = await locationService.getCities(countryCode)

    expect(result).toEqual([
      { id: 101, name: 'Toronto' },
      { id: 102, name: 'Vancouver' }
    ])

    const expectedUrl = `${countriesAPI.url}/${countryCode}/cities`
    const expectedHeaders = { [apiHeadersKey.COUNTRIES]: countriesAPI.apiKey }

    expect(axiosService.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders)
    expect(axiosService.get).toHaveBeenCalledTimes(1)
  })

  it('should handle errors when the API request fails', async () => {
    axiosService.get.mockRejectedValue(new Error('API Error'))

    await expect(locationService.getCities(countryCode)).rejects.toThrow('API Error')
  })
})
