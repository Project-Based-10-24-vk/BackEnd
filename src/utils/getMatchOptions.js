const getMatchOptions = (filters) => {
  const match = {}

  for (let [key, value] of Object.entries(filters)) {
    if (value) {
      match[key] = value
    }
    if (key === 'category' && value === null) {
      match[key] = value
    }
  }

  return match
}

module.exports = getMatchOptions
