const config = require('./config')
const createServer = require('./app')
const { port, env } = config

const app = createServer()

app.listen(port, () => {
  console.log(`Listening in ${env} mode on port ${port}`)
})
