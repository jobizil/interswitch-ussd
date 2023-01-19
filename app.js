const express = require('express')
const generateToken = require('./src/generateToken')
const getUssd = require('./src/getUssd')

function createServer() {
  const app = express()

  app.use(express.json())

  app.use(express.urlencoded({ extended: false }))

  app.get('/status', (req, res) => {
    return res.status(200).send('OK')
  })

  app.post('/get-token', generateToken)

  app.post('/get-ussd', getUssd)

  app.use((err, req, res, next) => {
    if (err.response) {
      res
        .status(err.response.status)
        .json({ error: { message: err.response.data } })
    } else {
      res.status(500).json({ error: { message: err.message } })
    }
  })

  //   app.use('/api/auth', authRoute)
  //   app.all('*', (req: Request, res: Response) => {
  //     return res.status(404).send('Not Found')
  //   })

  return app
}

module.exports = createServer
