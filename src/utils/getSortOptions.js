const getSortOptions = (sort) => {
  try {
    const { order, orderBy } = sort
    return { [orderBy || 'updatedAt']: order === 'asc' ? 1 : -1 }
  } catch (error) {
    return { updatedAt: 'desc' }
  }
}

module.exports = getSortOptions
