const { ussd_url } = require('../config')
const validateUssd = require('../util/ussd.validator')
const transactionReference = require('./generateReference')

/*  Takes in a data parameter and uses it to validate the USSD. 
  

*/

const getUssdHelper = async data => {
  const value = await validateUssd(data.body)

  const { authorization } = data.headers

  const token = authorization.startsWith('Bearer')
    ? authorization.split(' ')[1]
    : authorization

  if (!token)
    return res.status(401).json({ error: 'Authorization token is missing' })

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

  return options
}

module.exports = getUssdHelper
