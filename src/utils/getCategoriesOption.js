const getCategoriesOptions = (categories) => {
  if (Array.isArray(categories)) {
    return categories.map((item) => (item === 'null' ? null : item))
  }
  if (categories === 'null') {
    return null
  }
  if (categories) {
    return [categories]
  }

  return
}
module.exports = getCategoriesOptions
