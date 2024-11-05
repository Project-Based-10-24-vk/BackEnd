const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const getRegex = require('~/utils/getRegex')
const qs = require('qs')
const getCategoriesOptions = require('~/utils/getCategoriesOption')

const getArgs = (query, author = '') => {
  const parsedQuery = qs.parse(query)
  const { name = '', category, sort, skip = 0, limit = 5 } = parsedQuery
  const categoriesOptions = getCategoriesOptions(category)

  const match = getMatchOptions({ author, title: getRegex(name), category: categoriesOptions })
  const sortOptions = getSortOptions(sort)

  return [match, sortOptions, parseInt(skip), parseInt(limit)]
}

module.exports = getArgs
