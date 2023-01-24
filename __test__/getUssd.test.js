const { setupServer } = require('msw/node')
const { rest } = require('msw')
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

const valid_data = {
  amount: '2000',
  bankCode: 'ACCESS',
  surcharge: '0',
  currencyCode: '566',
  merchantTransactionReference: 'ef020d602d',
}

const res = {
  status: code => {
    return {
      json: data => {
        return {
          code,
          data,
        }
      },
    }
  },
}

describe('Initiate USSD transaction', () => {
  it('should return 401 invalid token', async () => {
    const req = {
      body: valid_data,
      headers: {
        authorization: `Bearer invalid_access_token`,
      },
    }
    server.use(
      rest.post(ussd_url, async (req, res, ctx) => {
        const result = await getUssd(req, res)
        expect(result.code).toBe(401)
      })
    )

    server.resetHandlers()
  })

  it('should return 200 with valid token', async () => {
    const req = {
      body: valid_data,
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    }

    server.use(
      rest.post(ussd_url, async (req, res, ctx) => {
        const result = await getUssd(req, res)
        expect(result.code).toBe(200)
      })
    )
    server.resetHandlers()
  })
})
