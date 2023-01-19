const axios = require('axios')
const { client_id, client_secret, grant_type, token_url } = require('../config')

const generateToken = async (req, res) => {
  try {
    const options = {
      url: token_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${client_id}:${client_secret}`
        ).toString('base64')}`,
      },
      data: `grant_type=${grant_type}`,
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

module.exports = generateToken
