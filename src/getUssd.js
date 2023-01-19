const axios = require('axios')
const { ussd_url } = require('../config')
const validateUssd = require('./util/ussd.validator')
const transactionReference = require('./util/generateReference')

const getUssd = async (req, res) => {
  try {
    const value = await validateUssd(req.body)

    const { authorization } = req.headers

    const token = authorization.startsWith('Bearer')
      ? authorization.split(' ')[1]
      : authorization

    const options = {
      url: ussd_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      data: {
        ...value,
        merchantTransactionReference: transactionReference(),
      },
    }

    const response = await axios(options)

    res.status(response.status).json(response.data)
  } catch (err) {
    if (err.response) {
      res
        .status(err.response.status)
        .json({ error: { message: err.response.data } })
    } else {
      res.status(500).json({ error: { message: err.message } })
    }
  }
}

module.exports = getUssd
