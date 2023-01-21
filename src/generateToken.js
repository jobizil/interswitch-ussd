const axios = require('axios')
const { client_id, client_secret, grant_type } = require('./config')
const generateTokenHelper = require('./util/generateTokenHelper')

const generateToken = async (_req, res) => {
  try {
    const option = generateTokenHelper(client_id, client_secret, grant_type)

    const result = await axios(option)

    res.status(result.status).json(result.data)
  } catch (err) {
    if (err.result) {
      res
        .status(err.result.status)
        .json({ error: { message: err.result.data } })
    } else {
      console.log(err)
      res.status(500).json({ error: { message: err.message } })
    }
  }
}

module.exports = generateToken
