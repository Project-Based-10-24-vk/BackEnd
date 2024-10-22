const bcrypt = require('bcrypt')

const encryptPassword = async (password) => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  return hashedPassword
}

const comparePassword = async (loginPassword, userPassword) => {
  const passwordCompare = await bcrypt.compare(loginPassword, userPassword)

  return passwordCompare
}

module.exports = {
  encryptPassword,
  comparePassword
}
