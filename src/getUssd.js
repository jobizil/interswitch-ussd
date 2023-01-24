const axios = require('axios')
const validateUssd = require('./util/ussd.validator')
const transactionReference = require('./util/generateReference')
const { ussd_url } = require('./config')

const getUssd = async (req, res) => {
  try {
    const token = getTokenFromHeaders(req.headers)

    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing' })
    }

    const { amount, bankCode, surcharge, currencyCode } = await validateUssd(
      req.body
    )

    const merchantTransactionReference = transactionReference()

    const ussdData = {
      amount,
      bankCode,
      surcharge,
      currencyCode,
      merchantTransactionReference,
    }

    const response = await axios.post(ussd_url, ussdData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return res.status(response.status).json(response.data)
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({ error: err.response.data })
    }
    return res.status(500).json({ error: { message: err.message } })
  }
}

function getTokenFromHeaders(headers) {
  const { authorization } = headers
  return authorization.startsWith('Bearer')
    ? authorization.split(' ')[1]
    : authorization
}

module.exports = getUssd
