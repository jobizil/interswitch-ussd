const crypto = require('crypto')

const transactionReference = (length = 10) => {
  const buffer = crypto.randomBytes(Math.ceil(length / 2))
  return buffer.toString('hex').slice(0, length)
}

module.exports = transactionReference
