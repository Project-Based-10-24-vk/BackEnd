const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const getRegex = require('~/utils/getRegex')
const qs = require('qs')

const getArgs = (query, author = '') => {
  const parsedQuery = qs.parse(query)
  const { name = '', category = '', sort, skip = 0, limit = 5 } = parsedQuery

  const match = getMatchOptions({ author, title: getRegex(name), category })
  const sortOptions = getSortOptions(sort)

  return [match, sortOptions, parseInt(skip), parseInt(limit)]
}

module.exports = getArgs
