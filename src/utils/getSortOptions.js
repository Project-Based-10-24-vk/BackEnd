const getSortOptions = (sort) => {
  try {
    const { order, orderBy } = JSON.parse(sort)
    return { [orderBy || 'updatedAt']: order === 'asc' ? 1 : -1 }
  } catch (error) {
    return { updatedAt: 'desc' }
  }
}

// const getSortOptions = (sort) => {
//   const sortCriteria = sort.split(',').reduce((acc, item) => {
//     const [orderBy, order] = item.split(':')
//     return { ...acc, [orderBy === 'name' ? 'title' : orderBy]: order === 'asc' ? 1 : -1 }
//   }, {})

//   return sortCriteria
// }

module.exports = getSortOptions
