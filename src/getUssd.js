const axios = require('axios')

const getUssdHelper = require('./util/ussdHelper')

/*
Uses the getUssdHelper function to make a request to the getUssd API
*/

const getUssd = async (req, res) => {
  try {
    const options = await getUssdHelper(req)
    const response = await axios(options)

    return res.status(response.status).json(response.data)
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({ error: err.response.data })
    }
    return res.status(500).json({ error: { message: err.message } })
  }
}

module.exports = getUssd
