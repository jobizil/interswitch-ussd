const Joi = require('joi')
const validateUssd = async data => {
  const ussdSchema = Joi.object({
    amount: Joi.string().required(),
    bankCode: Joi.string().required(),
    surcharge: Joi.string().required(),
    currencyCode: Joi.string().required(),
  })

  return ussdSchema.validateAsync(data)
}

module.exports = validateUssd
