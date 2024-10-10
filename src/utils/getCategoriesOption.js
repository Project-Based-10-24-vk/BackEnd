const getCategoriesOptions = (categories) => {
  if (Array.isArray(categories)) {
    return categories.map((item) => (item === 'null' ? null : item))
  } else {
    return
  }
}
module.exports = getCategoriesOptions
