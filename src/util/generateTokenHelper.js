const axios = require('axios')
const { token_url } = require('../config')

/* 
  Generates a token to be used for subsequent requests to the get token API

*/

const generateTokenHelper = (client_id, client_secret, grant_type) => {
  const authToken = `Basic ${Buffer.from(
    `${client_id}:${client_secret}`
  ).toString('base64')}`

  const options = {
    url: token_url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authToken,
    },
    data: `grant_type=${grant_type}`,
  }

  return options
}

module.exports = generateTokenHelper
