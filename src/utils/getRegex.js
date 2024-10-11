const getRegex = (regex = '') => ({
  $regex: regex.length > 0 ? new RegExp(regex, 'i') : '.*'
})

module.exports = getRegex
