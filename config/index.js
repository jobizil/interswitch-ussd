const dotenv = require('dotenv')

dotenv.config()

const {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  GRANT_TYPE,
  TOKEN_URL,
  USSD_URL,
  NODE_ENV,
} = process.env

module.exports = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  grant_type: GRANT_TYPE,
  token_url: TOKEN_URL,
  ussd_url: USSD_URL,
  env: NODE_ENV,
  port: PORT,
}
