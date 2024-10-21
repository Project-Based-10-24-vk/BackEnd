const locationService = require('~/services/location')
const axiosService = require('~/utils/axiosService')

jest.mock('~/utils/axiosService')

describe('locationService', () => {
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
