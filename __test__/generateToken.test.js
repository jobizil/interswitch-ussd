const { setupServer } = require('msw/node')
const { rest } = require('msw')
const axios = require('axios')
const generateTokenHelper = require('../src/util/generateTokenHelper')

const {
  client_id,
  client_secret,
  grant_type,
  token_url,
} = require('../src/config')

const server = setupServer(
  rest.post(token_url, (req, res, ctx) => {
    if (grant_type && client_id && client_secret) {
      return res(ctx.status(200))
    }
    return res(
      ctx.status(400),
      ctx.json({
        error: 'invalid_request',
        error_description: 'client_id is required',
      })
    )
  })
)
beforeAll(() => server.listen())
afterAll(() => server.close())

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
describe('generate access token from interswitch', () => {
  it('should generate a valid access token', async () => {
    const result = await generateTokenHelper(
      client_id,
      client_secret,
      grant_type
    )
    expect(result).toEqual(options)

    const response = await axios(result)

    expect(response.status).toBe(200)
  })

  it('should return 401 with invalid_client error message', async () => {
    const result = await generateTokenHelper(
      'invalid_client_id',
      'invalid_client_secret',
      grant_type
    )
    expect(result).not.toEqual(options)
  })

  it('should return 400 with invalid_request error message', async () => {
    const result = await generateTokenHelper(
      client_id,
      'invalid_client_secret',
      grant_type
    )
    expect(result).not.toEqual(options)
  })
})
