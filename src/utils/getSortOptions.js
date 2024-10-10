const getSortOptions = (sort) => {
  try {
    const { order, orderBy } = JSON.parse(sort)
    return { [orderBy || 'updatedAt']: order || 'desc' }
  } catch (error) {
    return { updatedAt: 'desc' }
  }
}

module.exports = getSortOptions
