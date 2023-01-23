const { setupServer } = require('msw/node')
const { rest } = require('msw')
const axios = require('axios')
const getUssdHelper = require('../src/util/ussdHelper')
const getUssd = require('../src/getUssd')
const { ussd_url, access_token } = require('../src/config')

const server = setupServer(
  rest.post(ussd_url, (req, res, ctx) => {
    if (req.headers.authorization === access_token) {
      return res(ctx.status(200))
    }
    return res(
      ctx.status(401),
      ctx.json({
        error: 'Unauthorized',
        error_description: 'Invalid token',
      })
    )
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

let options = {
  url: ussd_url,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${access_token}`,
  },
  data: {
    amount: '100',
    bankCode: 'GTB',
    surcharge: '0',
    currencyCode: '566',
  },
}

const valid_data = {
  amount: '100',
  bankCode: 'GTB',
  surcharge: '0',
  currencyCode: '566',
}

const req = {
  body: valid_data,
  headers: {
    authorization: `Bearer ${access_token}`,
  },
}

describe('Initiate USSD transaction', () => {
  it('should initiate USSD transaction successfully', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
    const result = await getUssdHelper(req)

    expect(result).toHaveProperty('url')
    expect(result).toHaveProperty('headers')
  })
})
